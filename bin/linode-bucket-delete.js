#!/usr/bin/env node

const aws = require('aws-sdk');
const dash = require('dashargs');
const joinURL = require('url-join');
const prompts = require('prompts');

const args = dash.argv();

const { key, secret, region, bucket } = args;

if (!key) return console.log('Please provide your access key | -key key');

if (!secret)
    return console.log('Please provide your access secret | -secret secret');

if (!region)
    return console.log('Please provide your region | -region us-east-1');

if (!bucket)
    return console.log('Please provide a bucket | -bucket bucket-name');

let agreed = args.has('y', 'yes');

const client = new aws.S3({
    accessKeyId: key,
    secretAccessKey: secret,
    endpoint: new aws.Endpoint(
        joinURL('https://', region + '.linodeobjects.com'),
    ),
});

(async () => {
    if (agreed != true) {
        const res = await prompts({
            type: 'confirm',
            name: 'agreed',
            message: `Are you sure you want to PERMANENTLY delete ${bucket}`,
        });

        agreed = res.agreed;
    }

    if (!agreed) return console.log('Exiting...'), process.exit(1);

    try {
        console.log('Deleting all objects, this may take some time...');
        await deleteAllObjects();

        console.log('Deleting bucket...');
        await client.deleteBucket({ Bucket: bucket }).promise();

        console.log(`${bucket} deleted`);
    } catch (e) {
        console.error('Error in uploading\n' + e);
        process.exit(1);
    }
})();

async function deleteAllObjects() {
    const { Contents: objects } = await client
        .listObjects({ Bucket: bucket, MaxKeys: 500 })
        .promise();

    if (objects.length > 0)
        console.log(`Fetched ${objects.length} objects, deleting...`);

    if (objects.length == 0) return;

    await client
        .deleteObjects({
            Bucket: bucket,
            Delete: {
                Objects: objects.map((x) => ({
                    Key: x.Key,
                })),
            },
        })
        .promise();

    return deleteAllObjects();
}
