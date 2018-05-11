'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-central-1'});

var dbConnection = new AWS.DynamoDB({region: 'eu-central-1', apiVersion: '2012-08-10'});

var catalogTableName = "pavelb-object"
/*


params:
itemId - optional
 */
exports.handler = (event, context, callback) => {

    var itemId;
    if (event.queryStringParameters)
        itemId = event.queryStringParameters.itemId;

    console.log(itemId);

    itemId ? findById(itemId, callback) : findAll(callback);

};

function findAll(callback) {
    getCatalogData()
        .then(response => {
            return buildresponseObject(response);
        })
        .then(catalogData => {
            console.log(catalogData);
            createResponse(200, catalogData, callback);
        })
        .catch(error => createResponse(400, {status: error.message}, callback));
}

function findById(itemId, callback) {
    getCatalogDataById(itemId)
        .then(response => {
            return buildresponseObject(response);
        })
        .then(catalogData => {
            console.log(catalogData);
            createResponse(200, catalogData, callback);
        })
        .catch(error => createResponse(400, {status: error.message}, callback));
}

/*
read all data from DB
 */
function getCatalogData(itemId) {
    var dbParams = {
        TableName: catalogTableName
    }

    return dbConnection.scan(dbParams).promise();
}

function getCatalogDataById(itemId) {
    var dbParams = {
        TableName: catalogTableName,
        Key: {
            "id": {
                "N": itemId
            }
        }
    }
    return dbConnection.getItem(dbParams).promise();
}


function buildresponseObject(response) {
    var catalogData = {items: []};
    console.log("response");
    console.log(response);
    if (response.Item) {
        catalogData.items.push(parseItem(response.Item));
    }
    else if (response.Items) {
        response.Items.forEach(function (item) {
            catalogData.items.push(parseItem(item));
        });
    }
    return catalogData;
}

function parseItem(item){
    let data = JSON.parse(item.data.S);
    data.id = item.id.N
    return data;
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
