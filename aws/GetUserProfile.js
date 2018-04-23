'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
var db = new AWS.DynamoDB();

var dbConnection = new AWS.DynamoDB({region: 'eu-central-1', apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    /*console.log('event =');
    console.log(event);
    console.log('context =');
    console.log( event.requestContext.authorizer.claims['cognito:username']);*/
    //var uid = "4e00135a-7d3a-48b4-9c9e-da0bd0b2967c";
    var uid = "0ad8d29b-124a-4374-b189-e4f78342d0e0";

    //var uid = event.requestContext.authorizer.claims['cognito:username']

    console.log('uid =', uid);

    if(!uid){
        createResponse(400, {status: "No user Id found in request"}, callback)
        return;
    }

    var dbParams = {
        TableName: "pavelb-userProfile",
        Key: {
            "uid": {
                "S": uid
            }
        }
    }

    dbConnection.getItem(dbParams).promise()
        .then(response => {
            return isValidProfileFound(response) ? parseProfile(response):
                createProfile(uid).then(insertResponse =>{return JSON.parse(insertResponse.Attributes.profile.S)});

        })
        .then(profile =>{
            console.log(profile);
            createResponse(200, profile, callback);
        })
        .catch(error => createResponse(400, {status: error.message}, callback) );

    //readItem(uid, callback);

};

function isValidProfileFound (response){
    console.log(response);
    if(response.Item && response.Item.profile){
        return true;
    }

    return false;

}

function parseProfile(response) {
    return JSON.parse(response.Item.profile.S);
}

function createProfile(uid){
    console.log("createProfile for: " + uid);
    let dbParams = {
        TableName: "pavelb-userProfile",
        Key: {
            "uid": {
                "S": uid
            }
        },
        AttributeUpdates: {
            profile: {
                Action: 'PUT',
                Value: {S: "{\"objects\":[]}"}
            }
        },
        "ReturnValues": "UPDATED_NEW"
    };

    return dbConnection.updateItem(dbParams).promise();

}



function createResponse(status, content, callback) {
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
