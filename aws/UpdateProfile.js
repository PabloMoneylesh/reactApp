'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

var dbRequest = new AWS.DynamoDB({region: 'eu-central-1', apiVersion: '2012-08-10'});

exports.handler = (event, context, callback) => {
    // TODO implement


    var uid = "0ad8d29b-124a-4374-b189-e4f78342d0e0";

    var operationType = "ADD";

    var objectId = "w534tgdfsb";



    var params = {
        TableName: "pavelb-userProfile",
        Key: {
            "uid":{S:uid}
        }
    }



    dbRequest.getItem(params).promise().then(
        response => {
            let profile =JSON.parse(response.Item.profile.S);
            return profile;
        }
    ).then(profile => {
        console.log(operationType);
        let data = getData();
        return updateProfile(profile, operationType, data);

    })
        .then(profile => {
            params.AttributeUpdates = {
                profile: {
                    Action: 'PUT',
                    Value: {S: JSON.stringify(profile)}
                }
            }
            return writeProfiletoDB(params);
        }).then(
        result => createResponse(200, {status:"OK"}, callback),
        error => createResponse(400, {status:error.message}, callback)
    )
    ;

};

function updateProfile(profile, operationType, data){
    if(operationType=="ADD"){
        profile.objects.push(data);
    }
    return profile;

}


function getData(){
    return  {
        "id": "w534tgdfsb",
        "startDate": new Date(),
        "endDate": "",
        "objectId": 4
    }
}

function writeProfiletoDB(params){
    console.log("writeProfiletoDB");
    console.log(params);

    return dbRequest.updateItem(params).promise();
}

function createResponse(status, content, callback) {
    console.log('createResponse =', JSON.stringify(content));

    const response = {
        statusCode: status,
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