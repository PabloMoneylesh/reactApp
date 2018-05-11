'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

var dbConnection = new AWS.DynamoDB({region: 'eu-central-1', apiVersion: '2012-08-10'});

var profileTableName="pavelb-userProfile"
/*
read user profile from the DB
if no profile found create new DB entry with profile and return it

params:
uid - user id from security context
 */
exports.handler = (event, context, callback) => {
    /*console.log('event =');
    console.log(event);
    console.log('context =');
    console.log( event.requestContext.authorizer.claims['cognito:username']);*/
    //var uid = "4e00135a-7d3a-48b4-9c9e-da0bd0b2967c";
    //var uid = "0ad8d29b-124a-4374-b189-e4f78342d0e0";

    /*
    get user Id from security context
     */
    var uid = event.requestContext.authorizer.claims['cognito:username']

    console.log('uid =', uid);

    if(!uid){
        createResponse(400, {status: "No user Id found in request"}, callback)
        return;
    }

    getProfile(uid)
        .then(response => {
            return isProfileFound(response) ? parseProfile(response):
                createProfile(uid).then(insertResponse =>{return JSON.parse(insertResponse.Attributes.profile.S)});
        })
        .then(profile =>{
            console.log(profile);
            createResponse(200, profile, callback);
        })
        .catch(error => createResponse(400, {status: error.message}, callback) );

};
/*
read user profile from DB
 */
function getProfile(uid){
    var dbParams = {
        TableName: profileTableName,
        Key: {
            "uid": {
                "S": uid
            }
        }
    }
  return  dbConnection.getItem(dbParams).promise();
}
/*
check the DB response for the profile
 */
function isProfileFound (response){
    console.log(response);
    if(response.Item && response.Item.profile){
        return true;
    }
    return false;
}
/*
parse and convert the DB response with user profile to the object
 */
function parseProfile(response) {
    return JSON.parse(response.Item.profile.S);
}

/*
if user profile not found create it and retrieve new profile
 */
function createProfile(uid){
    console.log("createProfile for: " + uid);
    let dbParams = {
        TableName: profileTableName,
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

/*
build json response to the clint
body contains user profile or error message
 */
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
