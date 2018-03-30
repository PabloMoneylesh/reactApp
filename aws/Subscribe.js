'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
var docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
    console.log('event =');
    console.log(event);
    console.log('context =');
    //console.log( event.requestContext.authorizer.claims['cognito:username']);
    var uid = "0ad8d29b-124a-4374-b189-e4f78342d0e0";
    //var uid = event.requestContext.authorizer.claims['cognito:username']
    console.log('uid =', uid);

    if(!uid){
        createErrorResponse('wrong UId',callback);
        return;
    }

    var params = {
        TableName: "pavelb-userProfile",
        Key: {
            "uid":uid
        }
    }

    readItem(params, callback);

};


function readItem(params, callback) {




    docClient.get(params, function (err, data) {
        console.log("getItem:" + params.Key.uid + ";");
        if (err) {
            console.log(err, err.stack);// an error occurred
            createResponse({}, callback);
        }
        else {
            console.log(data);           // successful response

            if(data.Item){
                updateItem(params, data, callback);

            }
            //createResponse({}, callback);

        }
    });
}


function updateItem(params, data, callback){
    console.log("updateItem:");
    var profile = JSON.parse(data.Item.profile);
    //console.log(profile.objects);

    var newProfileItem = {
        "id": "w534tgdfsb",
        "startDate": new Date(),
        "endDate": "",
        "objectId": 2
    }
    profile.objects.push(newProfileItem);

    var updateParams = params;
    updateParams.UpdateExpression = "set profile = :newProfile"
    //updateParams.ExpressionAttributeValues = profile;
    updateParams.ExpressionAttributeValues = {
        ":newProfile":JSON.stringify(profile)
    }
    updateParams.ReturnValues="UPDATED_NEW";

    console.log(updateParams)

    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });


}

function createResponse(content, callback) {
    console.log('content =', content);

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'access-control-allow-headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'access-control-allow-methods':'GET,OPTIONS',
            'access-control-allow-origin':'*',
        },
        body: JSON.stringify(content)
    };

    callback(null, response);
}

function createErrorResponse(message, callback) {

    const response = {
        statusCode: 400,
        headers: {
            'Content-Type': 'application/json',
            'access-control-allow-headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'access-control-allow-methods':'GET,OPTIONS',
            'access-control-allow-origin':'*',
        },
        body: message
    };

    callback(null, response);
}