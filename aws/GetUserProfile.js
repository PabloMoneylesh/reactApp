'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});
var db = new AWS.DynamoDB();

exports.handler = (event, context, callback) => {
    /*console.log('event =');
    console.log(event);
    console.log('context =');
    console.log( event.requestContext.authorizer.claims['cognito:username']);*/
    //var uid = event.queryStringParameters.uid;
    var uid = event.requestContext.authorizer.claims['cognito:username']
    console.log('uid =', uid);

    if(!uid){
        createErrorResponse('wrong UId',callback);
        return;
    }

    readItem(uid, callback);

};


function readItem(rowKey, callback) {

    var params = {
        TableName: "pavelb-userProfile",
        Key: {
            "uid": {
                "S": rowKey
            }
        }
    }

    db.getItem(params, function (err, data) {
        console.log("getItem:" + rowKey + ";");
        if (err) {
            console.log(err, err.stack);// an error occurred
            createResponse({}, callback);
        }
        else {
            console.log(data);           // successful response

            if(data.Item){
                createResponse(data.Item.profile.S, callback);
            }
            createResponse({}, callback);

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