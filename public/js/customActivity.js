define([
    'postmonger'
], function (
    Postmonger
) {
        'use strict';
        var Postmonger = require('postmonger');
        var connection = new Postmonger.Session();
        var payload = {};
        var eventDefinitionKey = '';
        var deFields = [];

        $(window).ready(function () {
            connection.trigger('ready');
            connection.trigger('requestInteraction');
        });

        function initialize(data) {
            if (data) {
                payload = data;
            }
            console.log("New-> " + JSON.stringify(payload));
            var apiKey = payload["arguments"].execute.inArguments[0]["api_key"];
            var title = payload["arguments"].execute.inArguments[0]["title"];
            var message = payload["arguments"].execute.inArguments[0]["message"];
            var emailKey = payload["arguments"].execute.inArguments[0]["emailKey"];
            var imageUrl = payload["arguments"].execute.inArguments[0]["imageUrl"];
            var deepLinkKey = payload["arguments"].execute.inArguments[0]["deepLinkKey"];
            var deepLinkVal = payload["arguments"].execute.inArguments[0]["deepLinkVal"];
            var channelid = payload["arguments"].execute.inArguments[0]["channel_id"];
            var campid = payload["arguments"].execute.inArguments[0]["camp_id"];
            $("#camp").val(campid);
            $("#titl").val(title);
            $("#imgurl").val(imageUrl);
            $("#msg").val(message);
            $("#apikey").val(apiKey);
            $("#deep").val(deepLinkKey);
            $("#deepval").val(deepLinkVal);
            $("#channel").val(channelid);
            $("#eml").val(emailKey);
        }


        function save() {
            var campaignId = parseInt($("#camp").val());
            var title = $("#titl").val();
            var imageUrl = $("#imgurl").val();
            var message = $("#msg").val();
            var apikey = $("#apikey").val();
            var deepLinkKey = $("#deep").val();
            var deepLinkVal = $("#deepval").val();
            var channelId = parseInt($("#channel").val());
            var emailKey = $("#eml").val();
            //Validations
            if (channelId == "") {
                channelId = 1;
            }
            
            payload["arguments"].execute.inArguments = [{
                "api_key": apikey,
                "emailKey": emailKey,
                "title": title,
                "message": message,
                "imageUrl": imageUrl,
                "deepLinkKey": deepLinkKey,
                "deepLinkVal": deepLinkVal,
                "channel_id": channelId,
                "camp_id": campaignId,
            }];
            payload["metaData"]["isConfigured"] = true;
            console.log("Payload is -> " + JSON.stringify(payload));
            connection.trigger('updateActivity', payload);
        }

        connection.on('initActivity', initialize);
        connection.on('clickedNext', save);
/*

        const Path = require('path');
const Pkg = require(Path.join(__dirname, '../../', 'package.json'));
const express = require('express');
//const jObj=require('jquery');
// Helper utility for verifying and decoding the jwt sent from Salesforce Marketing Cloud.
const verifyJwt = require(Path.join(__dirname, '../../backend/lib/', 'jwt.js'));
// Helper class that handles all the interactions with Salesforce Service Cloud
// and makes sure open connections are reused for subsequent requests.

const app = express();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// Register middleware that parses the request payload.
app.use(require('body-parser').raw({
	type: 'application/jwt'
}));

// Route that is called for every contact who reaches the custom split activity
app.post('/activity/execute', (req, res) => {
		//verifyJwt(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret,(err, decoded) => {
		var jwt = new verifyJwt({appSignature: Pkg.options.salesforce.marketingCloud.jwtSecret});

		// Object representing the data in the JWT
		var decoded = jwt.decode(req);
		console.log("Decoded after JWT: "+decoded);
		console.log("Calling execute");
		console.log("Body->"+JSON.stringify(req.body));
		console.log("JWT-> "+Pkg.options.salesforce.marketingCloud.jwtSecret);
		console.log("decoded->"+decoded);
		

		if (decoded && decoded.inArguments && decoded.inArguments.length > 0) {
			console.log("decoded->"+decoded);
			var apikey = decoded.inArguments[0]["api_key"];
            var title = decoded.inArguments[0]["title"];
            var message = decoded.inArguments[0]["message"];
            var emailKey = decoded.inArguments[0]["emailKey"];
            var imageUrl = decoded.inArguments[0]["imageUrl"];
            var deepLinkKey = decoded.inArguments[0]["deepLinkKey"];
            var deepLinkVal = decoded.inArguments[0]["deepLinkVal"];
            var channelId = decoded.inArguments[0]["channel_id"];
			var campaignId = decoded.inArguments[0]["camp_id"];
			var contactEmail=decoded.inArguments[0]["emailAddress"];
			console.log("Contact EMail--> "+contactEmail);
			var jsonObj = {};
			jsonObj["api_key"]=apikey;
            jsonObj["notifications"]=[];
            var notificationObj={};
            notificationObj["target"]={};
            notificationObj["target"][emailKey]=contactEmail;
            notificationObj["title"]=title;
            notificationObj["message"]=message;
            notificationObj["deep_link"]={};
            notificationObj["deep_link"][deepLinkKey]=deepLinkVal;
            notificationObj["image_URL"]=imageUrl;
            notificationObj["android_sound"]="Beep";
            notificationObj["ios_sound"]="Beep";
            notificationObj["channel_id"]=channelId;
            notificationObj["camp_id"]=campaignId;
            jsonObj["notifications"].push(notificationObj); 
			console.log("Json structure: " + JSON.stringify(jsonObj));
			var xhr = new XMLHttpRequest();
			xhr.open("POST", "https://cors-anywhere.herokuapp.com/https://mobile.useinsider.com/api/v1/notification/user", true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.onreadystatechange = function (e) {
				console.log(xhr.status);
				console.log(xhr.readyState);
				console.log(xhr.responseText);
			};
			xhr.send(JSON.stringify(jsonObj));
		} else {
			console.error('inArguments invalid.');
			return res.status(400).end();
		}
	//});
});

app.post('/activity/save',(req,res)=>{
	console.log("Body from publish-> "+JSON.stringify(req.body));
	res.send(200);
});

// Routes for saving, publishing and validating the custom activity. In this case
// nothing is done except decoding the jwt and replying with a success message.
app.post(/\/activity\/(publish|validate)/, (req, res) => {
	/*
	verifyJwt(req.body, Pkg.options.salesforce.marketingCloud.jwtSecret, (err, decoded) => {
		// verification error -> unauthorized request
		if (err) return res.status(401).end();

		return res.status(200).json({ success: true });
	});*//*
	console.log("Body from publish-> "+JSON.stringify(req.body));
	res.send(200);//).json({success:true});
});
*/
// Serve the custom activity's interface, config, etc.
app.use(express.static(Path.join(__dirname, '..', 'public')));

// Start the server and listen on the port specified by heroku or defaulting to 12345
app.listen(process.env.PORT || 12345, () => {
	console.log('Service Cloud customsplit backend is now running!');
});
    });
