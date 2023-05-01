const express = require("express");
const app = express();

//import functions to fetch data
const getInstaPageData = require("./igpagelevel");
const getInstaPostData = require("./igpostlevel");
const getFacePostData = require('./fbpostlevel');
const getFacePageData = require('./fbpagelevel');

//tokens
const igToken = require("./tokens/igtoken");
const tokenfblatam = require("./tokens/tokenfblatam");
const tokenfbbr = require("./tokens/tokenfbbr");

//============================== INSTAGRAM POST LEVEL =========================//

// //get insta post data LATAM
// getInstaPostData("17841457817656889", igToken);

// //get insta post data BR
// getInstaPostData("17841457253047574", igToken);

//============================== INSTAGRAM PAGE LEVEL =========================//

// //get insta page data BR
// getInstaPageData("17841457817656889", igToken);

// //get insta page data LATAM
// getInstaPageData("17841457253047574", igToken);

//============================== FACEBOOK POST LEVEL =========================//

// //get fb post level data BR
// getFacePostData('108683005456780', tokenfbbr);

// // get fb post level data LATAM
// getFacePostData('260411577472305', tokenfblatam);

//============================== FACEBOOK PAGE LEVEL =========================//

// // get fb page level data BR
// getFacePageData('108683005456780', tokenfbbr)

// // get fb page level data LATAM
// getFacePageData('260411577472305', tokenfblatam)


app.listen("8080", () => {
    console.log("Server running");
});