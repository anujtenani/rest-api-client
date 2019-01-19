const fetch = require('node-fetch');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const path = require('path');
AWS.config.loadFromPath(path.join(__dirname, '..', '/aws_credentials.json'));
const dynamoDb = new AWS.DynamoDB();

var express = require('express');
var router = express.Router();
const {applyActionsToStore} = require('../functions');

router.post('/google', async (req, res)=>{
    const { access_token } = req.body;
    const url = `https://www.googleapis.com/oauth2/v2/userinfo?key=${access_token}`;
    console.log(req.body);
    const profile = await fetch(url).then((res)=> res.json());
    const {email, given_name, name, family_name} = profile;
    const userId = shortId.generate();
    //save to database

    //search for a particular email address and return userId if available

    /*
    var params = {
        TableName: 'restclient_users',
        Item: {
            userId,
            ...profile
        }
    };
    dynamoDb.putItem(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
    jwt.sign()
    */
    res.send({...profile, userId, ...req.body, url});

});

function searchForEmail(email){
    var params = {
        TableName: 'restclient_users',
        Key: {
            email,
        },
        ProjectionExpression: 'ATTRIBUTE_NAME'
    };

// Call DynamoDB to read the item from the table
    ddb.getItem(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Item);
        }
    });
}

module.exports = router;
