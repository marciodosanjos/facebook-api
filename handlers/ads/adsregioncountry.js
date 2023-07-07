//packs
const { GoogleSpreadsheet } = require("google-spreadsheet");
const axios = require("axios");
const fetch = require("node-fetch");

// Initialize Google Sheets Auth
const creds = require("../../tokens/key.json");
const doc = new GoogleSpreadsheet(
  "1JlicWF4OP7qgyRXDR7UFp3zpjigT3Lx9DrqjF-8IlsU"
);

const getAdsRegionCountry = async (account, token) => {
  //========================== Step 1: Getting data via API ===========================

  const url = `https://graph.facebook.com/v16.0/${account}/insights?time_increment=1&time_range={since:'2023-05-01',until:'2023-05-10'}&level=ad&fields=ad_id,campaign_name, adset_name, ad_name,frequency, spend, reach, impressions, objective, optimization_goal, clicks, actions&action_breakdowns=action_type&breakdowns=region, country&access_token=${token}`;

  //raw data
  // let response = await axios.get(url);
  // let datum = response.data.data;
  // console.log(datum);

  //handle pagination
  async function fetchPaginatedData(url) {
    let allData = [];
    let nextUrl = url;
    do {
      const response = await fetch(nextUrl);
      const data = await response.json();
      if (data.data) {
        allData = allData.concat(data.data);
      } else {
        console.log({ error: data.error });
      }
      nextUrl = data.paging ? data.paging.next : null;
    } while (nextUrl);

    return allData;
  }

  const data = await fetchPaginatedData(url);

  // orgazing data on key metrics in arrays
  let cliques = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "link_click" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let postReaction = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "post_reaction" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let pageviewBR = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "offsite_conversion.custom.1352741932244210" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let pageviewLatam = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "offsite_conversion.custom.165961032929296" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let comments = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "comment" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let pageEngagement = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "page_engagement" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let postEngagement = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "post_engagement" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let shares = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) => (el.action_type == "post" ? 1 : 0));
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  let videoViews = data.map((el) => {
    if (el.actions) {
      let cliques = el.actions.find((el) =>
        el.action_type == "video_view" ? 1 : 0
      );
      cliques == undefined ? (cliques = 0) : cliques;
      return cliques.value == undefined
        ? (cliques.value = 0)
        : parseInt(cliques.value);
    } else {
      return 0;
    }
  });

  //   //storing the data on the ads performance in the array results
  let result = data.map((element, index) => {
    return {
      id:
        element.country.slice(0, 2) +
        element.region.slice(0, 2).toUpperCase() +
        element.reach +
        element.impressions +
        element.ad_name.slice(0, 4) +
        element.campaign_name.slice(1, 3),
      ad_id: element.ad_id,
      date_start: element.date_start,
      date_stop: element.date_stop,
      ad_name: element.ad_name,
      adset_name: element.adset_name,
      campaign_name: element.campaign_name,
      objective: element.objective,
      optimization_goal: element.optimization_goal,
      spend: element.spend,
      frequency: element.frequency,
      reach: element.reach,
      impressions: element.impressions,
      region: element.region,
      country: element.country,
      link_clicks: cliques[index],
      post_reaction: postReaction[index],
      pageview_br: pageviewBR[index],
      pageview_latam: pageviewLatam[index],
      comments: comments[index],
      page_engagement: pageEngagement[index],
      post_engagement: postEngagement[index],
      shares: shares[index],
      video_views: videoViews[index],
    };
  });

  console.log(result);
  console.log(result.map((el) => el.id));

  function temDuplicatas(arr) {
    const valoresUnicos = arr.map((elem, index, self) => {
      return self.indexOf(elem) === index;
    });
    return arr.length !== valoresUnicos.length;
  }

  console.log(temDuplicatas(result));
  console.log(result);

  //========================== Step 2: Recording data on DB ===========================
  await doc.useServiceAccountAuth(creds);

  // loads document properties and worksheets
  await doc.loadInfo();
  console.log(doc.title);

  // //add new sheet
  // const newSheet = await doc.addSheet({ title: "ads_region_country" });

  //instance sheet
  const adsRegionCountryPageSheet = doc.sheetsByIndex[5];

  //creating header columns
  await adsRegionCountryPageSheet.setHeaderRow([
    "id",
    "ad_id",
    "date_start",
    "date_stop",
    "ad_name",
    "adset_name",
    "campaign_name",
    "objective",
    "optimization_goal",
    "spend",
    "frequency",
    "reach",
    "impressions",
    "region",
    "country",
    "link_clicks",
    "post_reaction",
    "pageview_br",
    "pageview_latam",
    "comments",
    "page_engagement",
    "post_engagement",
    "shares",
    "video_views",
  ]);

  //get data from sheet
  const items = await adsRegionCountryPageSheet.getRows();

  //verify how many NEW records there is to load
  const newData = result.filter(
    (item) => !items.find((item2) => item.id == item2.id)
  );

  // verify how many records is on the db
  if (items.length == 0) {
    console.log("A planilha esta vazia");
    adsRegionCountryPageSheet.addRows(newData);
    console.log(
      `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
    );
  } else {
    console.log(
      `A tabela ${adsRegionCountryPageSheet.title} tem ${items.length} registros`
    );

    if (newData.length == 0) {
      setTimeout(() => console.log(`Não há registros novos para subir`), 2000);
      setTimeout(
        () =>
          console.log(
            `Os registros existentes correspondentes com a nova lista serão atualizados`
          ),
        3000
      );

      // update current row values
      currentRows = items.filter((item1) =>
        result.some((item2) => {
          if (item1.id == item2.id) {
            item1.ad_id = item2.ad_id; // update date value on db
            item1.date_start = item2.date_start; // update date_start value on db
            item1.date_stop = item2.date_stop; // update date_end value on db
            item1.ad_name = item2.ad_name; // update ad_name value on db
            item1.adset_name = item2.adset_name; // update adset_name value on db
            item1.campaign_name = item2.campaign_name; // update campaign_name value on db
            item1.objective = item2.objective; // update objective value on db
            item1.optimization_goal = item2.optimization_goal; // update optimization_goal value on db
            item1.spend = item2.spend; // update spend value on db
            item1.frequency = item2.frequency; // update frequency value on db
            item1.reach = item2.reach; // update reach reach on db
            item1.impressions = item2.impressions; // update impressions value on db
            item1.age = item2.age; // update age value on db
            item1.gender = item2.gender; // update gender value on db
            item1.link_clicks = item2.link_clicks; // update link_clicks value on db
            item1.post_reaction = item2.post_reaction; // update post_reaction value on db
            item1.pageview_br = item2.pageview_br; // update pageview_br value on db
            item1.pageview_latam = item2.pageview_latam; // update pageview_latam value on db
            item1.comments = item2.comments; // update comments value on db
            item1.page_engagement = item2.page_engagement; // update page_engagement value on db
            item1.post_engagement = item2.post_engagement; // update post_engagement value on db
            item1.shares = item2.shares; // update shares value on db
            item1.video_views = item2.video_views; // update video_views value on db
            item1.save(); // save updates
            setTimeout(
              () => console.log(`Record id ${item1.id} successfully updated`),
              4000
            );
          }
        })
      );
    } else {
      console.log(`Há ${newData.length} novo(s) item(s) para subir`);
      adsRegionCountryPageSheet.addRows(newData);
      console.log(
        `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
      );
    }
  }
};

module.exports = getAdsRegionCountry;
