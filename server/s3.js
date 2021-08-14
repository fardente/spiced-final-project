const aws = require("aws-sdk");
const fs = require("fs");

const AWS_KEY = process.env.AWS_KEY || require("./secrets").AWS_KEY;

const AWS_SECRET = process.env.AWS_SECRET || require("./secrets").AWS_SECRET;

const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

function upload(request, response, next) {
    console.log("uploading s3", request.file);
    if (!request.file) {
        console.log("No req.file!");
        // return response.sendStatus(500);
        next();
        return;
    }
    const { filename, mimetype, size, path } = request.file;

    s3.putObject({
        Bucket: "nandoseimer",
        ACL: "public-read",
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size,
    })
        .promise()
        .then((result) => {
            console.log("s3 result", result);
            next();
        })
        .catch((err) => {
            console.log(err);
            response.sendStatus(500);
        });
}

module.exports = {
    upload,
};
