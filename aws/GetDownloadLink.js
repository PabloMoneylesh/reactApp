'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

exports.handler = (event, context, callback) => {

    console.log(event);


    //var uid = "4e00135a-7d3a-48b4-9c9e-da0bd0b2967c";
    //var uid = "0ad8d29b-124a-4374-b189-e4f78342d0e0";

    let uid = event.requestContext.authorizer.claims['cognito:username']

    let bucketName;
    let fileKey;
    let itemUniqueId = event.queryStringParameters.id;

    bucketName = "mft-tests";
    fileKey = "group-dir/testFileA.txt";

    if(!uid){
        createResponse(400, {status: "No user Id found in request"}, callback)
        return;
    }

    getUserProfile(uid, event)
        .then(profile => checkIfObjectExistsInProfile(profile, itemUniqueId))
        .then(
            profileExists => profileExists ?  Promise.resolve(createResponse(200, {"url": getPresignedUrl(bucketName, fileKey)}, callback)) : Promise.reject("id not in profile")
        )
        .catch(error => console.log(createResponse(400, {status: "Something went wrong: " + error}, callback)));
};

function getUserProfile(uid, event){
    console.log("getUserProfile: " + uid);
    var lambda = new AWS.Lambda();

    return lambda.invoke({
        FunctionName: 'pavelb-react-app-test',
        Payload: JSON.stringify(event, null, 2)
    }).promise()
        .then(response => parseProfile(response));
}

function parseProfile(response){
    console.log( JSON.parse(JSON.parse(response.Payload).body).objects);
    return JSON.parse(JSON.parse(response.Payload).body).objects;
}

function checkIfObjectExistsInProfile(profile, id){
    let obj = profile.find(obj => obj.id == id);
    return !(obj === undefined);
}

function getPresignedUrl (bucketName, fileKey){
    console.log("getPresignedUrl: " + fileKey);
    var s3 = new AWS.S3();
    return s3.getSignedUrl('getObject', {
        Bucket: bucketName,
        Key: fileKey,
        Expires: 300
    });
}

function createResponse(status, content, callback) {
    console.log("createResponse: " + JSON.stringify(content));
    const response = {
        statusCode: status,
        headers: {
            'Content-Type': 'application/json',
            'access-control-allow-headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'access-control-allow-methods': 'GET,OPTIONS',
            'access-control-allow-origin': '*',
        },
        body: JSON.stringify(content)
    };

    callback(null, response);
}