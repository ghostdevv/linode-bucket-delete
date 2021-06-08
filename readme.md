# Linode Bucket Delete
A cli tool to help you upload to delete a linode object storage bucket

> **WARNING**: This tool deletes all objects inside the buckets which is __irreversible__ while this tool does have a confirmation step it can be skipped with `-y` flag, be careful!

# Installation
```bash
npm i -g linode-bucket-delete
```

# Usage
The cli is all done via a single command.
```bash
linode-bucket-delete -bucket bucket -region region -key key -secret secret
```

Options (all are required)<br>
- `bucket` this is the bucket to put the object in to<br>
- `key` this is the access key<br>
- `secret` this is the access secret<br>
- `region` this is the linode region, for example `eu-central-1`

# Tips
- ### Find Region
    1) Go to your [object storage manager](https://cloud.linode.com/object-storage/buckets)
    2) Under the bucket you are using it will look something like `bucket.eu-central-1.linodeobjects.com`. The bit after your bucket name and before linodeobjects.com is your region