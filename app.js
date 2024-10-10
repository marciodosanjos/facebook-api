const express = require("express");
const app = express();

//import functions to get data
const getInstaPostData = require("./handlers/postlevel/igpostlevel");
const getInstaPageData = require("./handlers/pagelevel/igpagelevel");
const getFacePageData = require("./handlers/pagelevel/fbpagelevel");
const getFacePostData = require("./handlers/postlevel/fbpostlevel");
const getAdsGenderAgeData = require("./handlers/ads/adsgenderage");
const getAdsRegionCountry = require("./handlers/ads/adsregioncountry");
const getAdsPlatform = require("./handlers/ads/adsplatform");

//tokens
const userAccessToken = require("./tokens/userAccessToken");
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
// getFacePostData("108683005456780", tokenfbbr);

// // get fb post level data LATAM
// getFacePostData("260411577472305", tokenfblatam);

//============================== FACEBOOK PAGE LEVEL =========================//

// //get fb page level data BR
// getFacePageData("108683005456780", tokenfbbr);

// //get fb page level data LATAM
// getFacePageData("260411577472305", tokenfblatam);

//============================== ADS ========================================//

//get ads data gender and age breakdown'
getAdsGenderAgeData("act_726387872139953", userAccessToken);

// // get ads data region and country breakdown
// getAdsRegionCountry("act_726387872139953", igToken);

// get ads data plattform breakdown
// getAdsPlatform("act_726387872139953", igToken);

//
//============================== Google ========================================//

app.listen("8080", () => {
  console.log("Server running");
});
