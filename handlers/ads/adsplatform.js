//packs
const { GoogleSpreadsheet } = require("google-spreadsheet");
const axios = require("axios");
const fetch = require("node-fetch");

// Initialize Google Sheets Auth
const creds = require("../../tokens/key.json");
const doc = new GoogleSpreadsheet(
  "1JlicWF4OP7qgyRXDR7UFp3zpjigT3Lx9DrqjF-8IlsU"
);

// ?time_increment=1&time_range={since:'2024-09-01',until:'2024-09-31'}&level=ad&fields= reach, impressions&breakdowns=publisher_platform,platform_position, device_platform,impression_device

const getAdsPlatform = async (account, token) => {
  //========================== Step 1: Fechting data via API ===========================
  const url = `https://graph.facebook.com/v19.0/${account}/insights?time_increment=1&time_range={since:'2025-02-15',until:'2025-02-28'}&level=ad&fields=ad_id,campaign_name, adset_name, ad_name,frequency, spend, reach, impressions, objective, optimization_goal, clicks, actions&action_breakdowns=action_type&breakdowns=publisher_platform,platform_position, device_platform,impression_device&access_token=${token}`;

  //raw data
  // let response = await axios.get(url);
  // let datum = response.data.data;
  // console.log(datum);

  async function fetchPaginatedData(url) {
    let allData = [];
    let nextUrl = url;
    let retryCount = 0;
    const maxRetries = 5;

    do {
      try {
        console.log("Fetching data...");
        const response = await fetch(nextUrl, { timeout: 30000 }); // timeout em milissegundos (30 segundos)

        const data = await response.json();
        if (data.data) {
          allData = allData.concat(data.data);
        } else {
          console.log({ error: data.error });
        }
        nextUrl = data.paging ? data.paging.next : null;

        // Reset retry count on successful request
        retryCount = 0;
      } catch (error) {
        console.error(`Fetch error: ${error.message}`);
        if (retryCount >= maxRetries) {
          console.error("Max retries reached, aborting...");
          break;
        }

        // Aguardar com backoff exponencial
        const delay = Math.pow(2, retryCount) * 1000; // Ex: 1s, 2s, 4s, 8s...
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await sleep(delay);
        retryCount++;
      }
    } while (nextUrl);

    return allData;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const data = await fetchPaginatedData(url);

  // Somar o reach de todos os itens no array inicial
  const totalReachInit = data.reduce((sum, item) => {
    return sum + parseInt(item.reach); // Converter reach para número
  }, 0);

  // Somar o reach de todos os itens no array inicial
  const totalImpressionshInit = data.reduce((sum, item) => {
    return sum + parseInt(item.impressions); // Converter reach para número
  }, 0);

  console.log("Total itens no array inicial:", data.length);

  console.log(
    "Total reach de todos os itens no array inicial:",
    totalReachInit
  );

  console.log(
    "Total impression de todos os itens no array inicial:",
    totalImpressionshInit
  );

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

  //storing the data on the ads performance in the array results
  let result = data.map((element, index) => {
    function generateUniqueId(element) {
      const publisher_platform = element.publisher_platform.slice(0, 2);
      const platform_position = element.platform_position
        .slice(0, 2)
        .toUpperCase();
      const adsetName = element.adset_name.slice(3, 5);
      const impressionDevPart = element.impression_device.slice(1, 4);
      const fullDevice = element.impression_device;
      const campaignName = element.campaign_name.slice(1, 3);
      const adId = element.ad_id.slice(2, 8);
      const dateStart = element.date_start.slice(3, 5);

      // Concatenando os valores usando um delimitador "_"
      const uniqueId = `${publisher_platform}_${platform_position}_${adsetName}_${impressionDevPart}_${fullDevice}_${campaignName}_${adId}_${dateStart}_${Date.now()}`;

      return uniqueId;
    }
    return {
      id: generateUniqueId(element),
      ad_id: element.ad_id,
      date_start: element.date_start,
      date_stop: element.date_stop,
      ad_name: element.ad_name,
      adset_name: element.adset_name,
      campaign_name: element.campaign_name,
      objective: element.objective,
      optimization_goal: element.optimization_goal,
      spend: element.spend,
      frequency: element.frequency ? element.frequency : 0,
      reach: element.reach ? element.reach : 0,
      impressions: element.impressions ? element.impressions : 0,
      publisher_platform: element.publisher_platform,
      platform_position: element.platform_position,
      link_clicks: cliques[index],
      post_reaction: postReaction[index],
      pageview_br: pageviewBR[index],
      pageview_latam: pageviewLatam[index],
      comments: comments[index],
      page_engagement: pageEngagement[index],
      post_engagement: postEngagement[index],
      shares: shares[index],
      video_views: videoViews[index],
      device_platform: element.device_platform,
      impression_device: element.impression_device,
    };
  });

  function temDuplicatas(arr) {
    const valoresUnicos = arr.map((elem, index, self) => {
      return self.indexOf(elem) === index;
    });
    return arr.length !== valoresUnicos.length;
  }

  //========================== Step 2: Recording data on DB ===========================
  await doc.useServiceAccountAuth(creds);

  // loads document properties and worksheets
  await doc.loadInfo();
  console.log(doc.title);

  // //add new sheet
  // const newSheet = await doc.addSheet({ title: "ads_region_country" });

  //instance sheet
  const adsPlatformPageSheet = doc.sheetsByIndex[6];

  //creating header columns
  await adsPlatformPageSheet.setHeaderRow([
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
    "publisher_platform",
    "platform_position",
    "link_clicks",
    "post_reaction",
    "pageview_br",
    "pageview_latam",
    "comments",
    "page_engagement",
    "post_engagement",
    "shares",
    "video_views",
    "device_platform",
    "impression_device",
  ]);

  //get data from sheet
  const items = await adsPlatformPageSheet.getRows();

  //verify how many NEW records there is to load
  // Filtrar itens de listaA que não estão em listaB, comparando por id
  const newData = result.filter(
    (itemNovo) =>
      !items.some(
        (itemExisente) =>
          String(itemNovo.id).trim() === String(itemExisente.id).trim()
      )
  );

  console.log("Total de itens novos", newData.length);

  // Somar o reach de todos os itens no array final
  const totalReachNewItems = newData.reduce((sum, item) => {
    return sum + parseInt(item.reach); // Converter reach para número
  }, 0);

  console.log("Total reach nos itens novos:", totalReachNewItems);

  // Function to handle rate-limited writing
  const requestsPerMinute = 300;
  let currentRequests = 0;
  const requestQueue = [];

  // Function to process the queue
  async function processQueue() {
    while (requestQueue.length > 0 && currentRequests < requestsPerMinute) {
      const { action, params } = requestQueue.shift(); // Get the next request from the queue
      currentRequests++;
      await action(...params);
    }
  }

  // Interval to reset the request count every minute
  setInterval(() => {
    currentRequests = 0;
    processQueue(); // Process any remaining requests in the queue
  }, 60000); // 1 minute in milliseconds

  // verify how many records is on the db
  if (items.length == 0) {
    console.log("A planilha esta vazia");
    requestQueue.push({
      action: adsPlatformPageSheet.addRows.bind(adsPlatformPageSheet),
      params: [newData],
    });
    console.log(
      `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
    );
  } else {
    console.log(
      `A tabela ${adsPlatformPageSheet.title} tem ${items.length} registros`
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
      await Promise.all(
        items.filter((item1) =>
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
              requestQueue.push({
                action: item1.save.bind(item1),
                params: [],
              });
              setTimeout(
                () => console.log(`Record id ${item1.id} successfully updated`),
                4000
              );
            }
          })
        )
      );
    } else {
      console.log(`Há ${newData.length} novo(s) item(s) para subir`);
      requestQueue.push({
        action: adsPlatformPageSheet.addRows.bind(adsPlatformPageSheet),
        params: [newData],
      });
      console.log(
        `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
      );
    }
  }
  // Start processing the queue immediately
  await processQueue();
};

module.exports = getAdsPlatform;
