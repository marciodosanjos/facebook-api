const bizSdk = require("facebook-nodejs-business-sdk");
const axios = require("axios");
require("dotenv").config();

const accountId = "act_726387872139953";
let appAccessToken = null;
const userToken =
  "EAAKp4M8mbCgBO5pMlgNy49F8gaWRCTOmyZCJZChRhgOOWQDkqNsZCHa7MVghO674FXYBoJlh6cT41HewG2Fq4RgS5cSqZBHN7Ew0CRHlviWZCsTLJXItJFM0JT3ZCq2dHa8u5hAWgAAzYlJRkOtk7ivv65ewUCB8HHFeJAIpg8S6TSNVCEObV4ZA8tZBDhjsnYZCEjmKeuVvo8AaicVAluwZDZD";

const getAppAccessToken = async () => {
  const appId = process.env.FB_APP_ID;

  const clientSecret = process.env.FB_APP_SECRET;
  const accountId = process.env.FB_ACCOUNT_ID;
  const url = `https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${clientSecret}&grant_type=client_credentials`;

  try {
    const response = await axios.get(url);
    const sessionAppAccessToken = response.data.access_token;
    appAccessToken = sessionAppAccessToken;

    return appAccessToken;
  } catch (error) {
    console.error(error.message);
  }
};

const main = async () => {
  await getAppAccessToken();

  console.log(appAccessToken);

  const FacebookAdsApi = bizSdk.FacebookAdsApi.init(appAccessToken);
  //const FacebookAdsApi = bizSdk.FacebookAdsApi.init(userToken);

  const AdAccount = bizSdk.AdAccount;
  const Campaign = bizSdk.Campaign;
  const Ads = bizSdk.AdsInsights;

  const account = new AdAccount(accountId);

  var campaigns;
  account
    .read([AdAccount.Fields.name])
    .then((account) => {
      return account.getCampaigns(
        [
          Campaign.Fields.name,
          // Campaign.Fields.ad_name,
          //Ads.Fields.frequency,
          // Campaign.Fields.spend,
          //  Campaign.Fields.reach,
          // Campaign.Fields.impressions,
          // Campaign.Fields.impressions,
          // Campaign.Fields.objective,
          // Campaign.Fields.optimization_goal,
          // Campaign.Fields.clicks,
          // Campaign.Fields.actions,
        ],
        { limit: 10 }
      ); // fields array and params
    })
    .then((result) => {
      campaigns = result;
      campaigns.forEach((campaign) => console.log(campaign.name));
    })
    .catch(console.error);
};

main();

// const url = `https://graph.facebook.com/v19.0/${account}/insights?time_increment=1&time_range={since:'2024-04-01',until:'2024-04-15'}&level=ad&fields=ad_id,campaign_name, adset_name, ad_name,frequency,spend,reach,impressions,objective,optimization_goal,clicks,actions&action_breakdowns=action_type&breakdowns=age,gender&access_token=${token}`;

// account
//   .read([AdAccount.Fields.name])
//   .then((account) => {
//     console.log(account.age);

//     return account.getCampaigns(
//       [
//         Campaign.Fields.objective,
//         // Campaign.Fields.ad_name,
//         //Ads.Fields.frequency,
//         // Campaign.Fields.spend,
//         //  Campaign.Fields.reach,
//         // Campaign.Fields.impressions,
//         // Campaign.Fields.impressions,
//         // Campaign.Fields.objective,
//         // Campaign.Fields.optimization_goal,
//         // Campaign.Fields.clicks,
//         // Campaign.Fields.actions,
//       ],
//       { limit: 10 }
//     ); // fields array and params
//   })
//   .then((result) => {
//     campaigns = result;
//     campaigns.forEach((campaign) => console.log(campaign.name));
//   })
//   .catch(console.error);
