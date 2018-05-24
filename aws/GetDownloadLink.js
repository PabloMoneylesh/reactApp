'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

var profileLambdaName = "pavelb-react-app-test";
var catalogLambdaName = "pavelb-react-app-catalog";

exports.handler = (event, context, callback) => {

    console.log(event);


    //var uid = "4e00135a-7d3a-48b4-9c9e-da0bd0b2967c";
    //var uid = "0ad8d29b-124a-4374-b189-e4f78342d0e0";

    let uid = event.requestContext.authorizer.claims['cognito:username']

    let itemUniqueId = event.queryStringParameters.id;

    if(!uid){
        createResponse(400, {status: "No user Id found in request"}, callback)
        return;
    }

    getUserProfile(uid, event)
        .then(profile => foundItemIdForObjectInProfile(profile, itemUniqueId))
        .then(
            itemId => itemId ? getBucketAndKeyForItem(itemId, event) : Promise.reject("id not in profile")
        )
        .then(
            bucketAndKeyForItem => bucketAndKeyForItem ? createResponse(200, {"url": getPresignedUrl(bucketAndKeyForItem)}, callback) : Promise.reject("item not found in catalog")
        )
        .catch(error => console.log(createResponse(400, {status: "Something went wrong: " + error}, callback)));
};
//Promise.resolve(createResponse(200, {"url": getPresignedUrl(bucketName, fileKey)}, callback))
function getUserProfile(uid, event){
    console.log("getUserProfile: " + uid);
    var lambda = new AWS.Lambda();

    return lambda.invoke({
        FunctionName: profileLambdaName,
        Payload: JSON.stringify(event, null, 2)
    }).promise()
        .then(response => parseProfile(response));
}

function parseProfile(response){
    console.log( JSON.parse(JSON.parse(response.Payload).body).objects);
    return JSON.parse(JSON.parse(response.Payload).body).objects;
}

function foundItemIdForObjectInProfile(profile, id){
    let obj = profile.find(obj => obj.id == id);
    if (obj && obj.itemId) {
        console.log("foundItemIdForObjectInProfile " + obj.itemId);
        return obj.itemId
    }

    return null;
}

function getBucketAndKeyForItem(itemId, event){
    var lambda = new AWS.Lambda();

    console.log("getBucketAndKeyForItem " + itemId);

    let newEvent= event;
    newEvent.queryStringParameters={"itemId": itemId};

    return lambda.invoke({
        FunctionName: catalogLambdaName,
        Payload: JSON.stringify(newEvent, null, 2)
    }).promise()
        .then(response => parseCatalogItem(response));
}

function  parseCatalogItem(response){
    console.log("parseCatalogItem");
    var bucketAndKeyForItem = {};
    let respBody=JSON.parse(JSON.parse(response.Payload).body);
    if(respBody.items && respBody.items[0]){
        bucketAndKeyForItem.bucket=respBody.items[0].bucket;
        bucketAndKeyForItem.key=respBody.items[0].key;
        return bucketAndKeyForItem;
    }
    return null;
}

function getPresignedUrl (bucketAndKeyForItem){
    console.log("getPresignedUrl: " );
    console.log(bucketAndKeyForItem);
    var s3 = new AWS.S3();
    return s3.getSignedUrl('getObject', {
        Bucket: bucketAndKeyForItem.bucket,
        Key: bucketAndKeyForItem.key,
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