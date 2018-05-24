'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

var dbConnection = new AWS.DynamoDB({region: 'eu-central-1', apiVersion: '2012-08-10'});

var newProfileObject;

var profileTableName="pavelb-userProfile";

/*
add new entry to the user profile
params:
uid - user id from security context
itemUniqueId - unique Id of the entry in users profile
itemId - id of the file object from catalog
subscriptionPeriod - period for subscription
 */

exports.handler = (event, context, callback) => {
    console.log(event);
    let body = JSON.parse(event.body);

    var uid = event.requestContext.authorizer.claims['cognito:username']

    var operationType = "ADD";
    let itemUniqueId = body.itemUniqueId;
    let itemId = body.itemId;
    let subscriptionPeriod = body.subscriptionPeriod;

    newProfileObject = buildNewProfileObject(itemUniqueId, itemId, subscriptionPeriod);



    getUserProfile(uid)
        .then(response => {
            return JSON.parse(response.Item.profile.S);
        })
        .then(profile => {
            return updateProfile(profile, operationType, prepareNewProfileObject());
        })
        .then(profile => {
            return writeProfiletoDB(prepareUpdateRequestParams(uid, profile));
        })
        .then(
            result => createResponse(200, {status: "OK"}, callback),
            error => createResponse(400, {status: error.message}, callback)
        )
        .catch(error => createResponse(400, {status: error.message}, callback) );

};
/*
read profile from DB
 */
function getUserProfile(uid){

    var dbParams = {
        TableName: profileTableName,
        Key: {"uid": {S: uid}}
    };

    return dbConnection.getItem(dbParams).promise();
}
/*
add new entry to the profile object
 */
function updateProfile(profile, operationType, data) {
    if (operationType == "ADD") {
        let existingObject = profile.objects.find(obj => obj.itemId == data.itemId);
        if (!existingObject) {
            profile.objects.push(data);
        }
        else {
            existingObject.startDate = data.startDate;
            existingObject.endDate = data.endDate;
            existingObject.id = data.id;
        }
    }
    return profile;

}
/*
build request object for DB update
 */
function prepareUpdateRequestParams(uid, data){
    var dbParams = {
        TableName: profileTableName,
        Key: {"uid": {S: uid}},
        AttributeUpdates: {
            profile: {
                Action: 'PUT',
                Value: {S: JSON.stringify(data)}
            }
        }
    };
    return dbParams;
}

function buildNewProfileObject(itemUniqueId, itemId, subscriptionPeriod) {
    return {
        "id": itemUniqueId,
        "startDate": new Date(),
        "endDate": new Date(new Date().setMonth(new Date().getMonth() + subscriptionPeriod)),
        "itemId": itemId
    }
}

function prepareNewProfileObject() {
    return newProfileObject;
}

function writeProfiletoDB(params) {
    return dbConnection.updateItem(params).promise();
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