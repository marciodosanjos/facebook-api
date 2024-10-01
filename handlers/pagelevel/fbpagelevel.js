//packs
const { GoogleSpreadsheet } = require("google-spreadsheet");
const axios = require("axios");
const fetch = require("node-fetch");

// Initialize Google Sheets Auth
const creds = require("../../tokens/key.json");
const doc = new GoogleSpreadsheet(
  "1JlicWF4OP7qgyRXDR7UFp3zpjigT3Lx9DrqjF-8IlsU"
);

const getFacePageData = async (pageid, token) => {
  //========================== Step 1: Fetching raw data via API ===========================

  //url
  const url = `https://graph.facebook.com/v19.0/${pageid}/insights?metric=page_posts_impressions_paid,page_posts_impressions_paid_unique, page_posts_impressions_organic,page_posts_impressions_organic_unique, page_total_actions, page_post_engagements, page_fan_adds_by_paid_non_paid_unique,page_actions_post_reactions_total,page_fans,page_fan_adds, page_fan_removes&since=2024-08-31&until=2024-09-30&period=day&access_token=${token}`;

  let response = await axios.get(url);
  const data = response.data.data;

  //date
  const date = [];
  data.map((el) => {
    const rawValues = el.values;
    date.push(rawValues.map((el) => el.end_time));
  });
  const finalDate = date[0];

  //page_posts_impressions_paid
  const rawImp = data[0].values;
  const paidImpressions = rawImp.map((el) => el.value);

  //page_posts_impressions_paid_unique
  const rawImpUnique = data[1].values;
  const paidImpressionsUnique = rawImpUnique.map((el) => el.value);

  //page_posts_impressions_organic
  const rawOrgImp = data[2].values;
  const organicImpressions = rawOrgImp.map((el) => el.value);

  //page_posts_impressions_organic_unique
  const rawOrgImpUnique = data[3].values;
  const organicImpressionsUnique = rawOrgImpUnique.map((el) => el.value);

  //page_engaged_users
  //const rawEngagedUsers = data[4].values
  //const engagedUsers = rawEngagedUsers.map((el) => el.value);
  const engagedUsers = 0;

  //page_total_actions
  const rawTotalActions = data[4].values;
  const totalActions = rawTotalActions.map((el) => el.value);

  //page_post_engagements
  const rawEngagements = data[5].values;
  const engagements = rawEngagements.map((el) => el.value);

  //link_clicks
  const rawClicks = data[6].values;
  const linkClicks = rawClicks.map((el) =>
    el.value["link clicks"] == undefined ? 0 : el.value["link clicks"]
  );

  //clicks_video_play
  const videoPlayClicks = rawClicks.map((el) =>
    el.value["video play"] == undefined ? 0 : el.value["video play"]
  );

  //other_clicks
  const otherClicks = rawClicks.map((el) =>
    el.value["other clicks"] == undefined ? 0 : el.value["other clicks"]
  );

  //new_page_fans_paid
  const rawPageFans = data[7].values;
  const pageFansPaid = rawPageFans.map((el) =>
    el.value["paid"] == undefined ? 0 : el.value["paid"]
  );

  //new_page_fans_organic
  const pageFansOrganic = rawPageFans.map((el) =>
    el.value["unpaid"] == undefined ? 0 : el.value["unpaid"]
  );

  //likes
  const postReactions = data[8].values;
  const likes = postReactions.map((el) =>
    el.value["like"] == undefined ? 0 : el.value["like"]
  );

  //reaction loves in the posts
  const loves = postReactions.map((el) =>
    el.value["love"] == undefined ? 0 : el.value["love"]
  );

  //page_fans: Lifetime Total Likes
  const rawpageFans = data[9].values;
  const pageFans = rawpageFans.map((el) => el.value);

  //page_fan_adds: Daily New Likes
  const rawpageFansAdds = data[10].values;
  const pageFansAdds = rawpageFansAdds.map((el) => el.value);

  // //page_fan_removes: Daily Unlikes
  // const rawpageFansRemoves = data[11].values;
  // const pageFansRemoves = rawpageFansRemoves.map((el) => el.value);

  //page_fans_ads: Daily Like Sources from page fan coming from Ads
  // const rawpageFansAds = data[13].values;
  // const pageFansAds = rawpageFansAds.map((el) =>
  //   el.value["Ads"] == undefined ? 0 : el.value["Ads"]
  // );
  const pageFansAds = 0;

  //page_fans_page: Daily Like Sources from fan coming from the owned Page
  // const pageFansYourPage = rawpageFansAds.map((el) =>
  //   el.value["Your Page"] == undefined ? 0 : el.value["Your Page"]
  // );

  const pageFansYourPage = 0;

  //page_fans_page: Daily Like Sources from fan coming from other sources
  // const pageFansSourceOthers = rawpageFansAds.map((el) =>
  //   el.value["Other"] == undefined ? 0 : el.value["Other"]
  // );

  const pageFansSourceOthers = 0;

  //send data to array of objects
  const fbPageData = finalDate.map((item, index) => {
    return {
      date: item,
      id:
        item.slice(6, 7) +
        item.slice(8, 10) +
        pageid.slice(1, 6) +
        new Date().getFullYear(),
      paid_impressions: paidImpressions[index],
      paid_impressions_unique: paidImpressionsUnique[index],
      organic_impressions: organicImpressions[index],
      impressions_organic_unique: organicImpressionsUnique[index],
      engaged_users: engagedUsers, // até 01.04 estava engagedUsers[index]. Metrica foi depreciada
      total_actions: totalActions[index],
      engagements: engagements[index],
      engaged_users: engagedUsers[index],
      link_clicks: linkClicks[index],
      video_play_clicks: videoPlayClicks[index],
      other_clicks: otherClicks[index],
      page_fans_paid: pageFansPaid[index],
      new_page_fans_organic: pageFansOrganic[index],
      likes: likes[index],
      loves: loves[index],
      page_fans: pageFans[index],
      page_fans_adds: pageFansAdds[index],
      page_fans_removes: 0,
      page_fans_source_ads: pageFansAds,
      page_fans_source_your_page: pageFansYourPage,
      page_fans_source_others: pageFansSourceOthers,
      pageid: pageid,
    };
  });

  console.log(fbPageData);

  //========================== Step 2: Recording data on DB ===========================

  await doc.useServiceAccountAuth(creds);

  // loads document properties and worksheets
  await doc.loadInfo();
  console.log(doc.title);

  // //add new sheet
  // const facePageSheet = await doc.addSheet({ title: "facepage" });

  //instanciando planilha instaposts
  const facePageSheet = doc.sheetsByIndex[3];

  //creating header columns
  await facePageSheet.setHeaderRow([
    "date",
    "id",
    "paid_impressions",
    "paid_impressions_unique",
    "organic_impressions",
    "impressions_organic_unique",
    "engaged_users",
    "total_actions",
    "engagements",
    "link_clicks",
    "video_play_clicks",
    "other_clicks",
    "page_fans_paid",
    "new_page_fans_organic",
    "likes",
    "loves",
    "page_fans",
    "page_fans_adds",
    "page_fans_removes",
    "page_fans_source_ads",
    "page_fans_source_your_page",
    "page_fans_source_others",
    "pageid",
  ]);

  //obtendo dados da plan
  const items = await facePageSheet.getRows();
  console.log(items);

  //verify how many NEW records there is to load
  const newData = fbPageData.filter(
    (item) => !items.find((item2) => item.id == item2.id)
  );

  // verify how many records is on the db
  if (items.length == 0) {
    console.log("A planilha esta vazia");
    // facePageSheet.addRows(newData);
    console.log(
      `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
    );
  } else {
    console.log(
      `A tabela ${facePageSheet.title} tem ${items.length} registros`
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
        fbPageData.some((item2) => {
          if (item1.id == item2.id) {
            item1.date = item2.date; // update date value on db
            item1.paid_impressions = item2.paid_impressions; // update paid_impressions value on db
            item1.paid_impressions_unique = item2.paid_impressions_unique; // update paid_impressions_unique value on db
            item1.organic_impressions = item2.organic_impressions; // update organic_impressions value on db
            item1.post_impressions_organic = item2.post_impressions_organic; // update post_impressions_organic value on db
            item1.impressions_organic_unique = item2.impressions_organic_unique; // update impressions_organic_unique value on db
            item1.engaged_users = item2.engaged_users; // update engaged_users value on db
            item1.total_actions = item2.total_actions; // update total_actions value on db
            item1.engagements = item2.engagements; // update engagements value on db
            item1.link_clicks = item2.link_clicks; // update link_clicks value on db
            item1.video_play_clicks = item2.video_play_clicks; // update video_play_clicks value on db
            item1.other_clicks = item2.other_clicks; // update other_clicks value on db
            item1.page_fans_paid = item2.page_fans_paid; // update page_fans_paid value on db
            item1.new_page_fans_organic = item2.new_page_fans_organic; // update new_page_fans_organic value on db
            item1.likes = item2.likes; // update likes value on db
            item1.loves = item2.loves; // update loves value on db
            item1.page_fans = item2.page_fans; // update page_fans value on db
            item1.page_fans_adds = item2.page_fans_adds; // update page_fans_adds value on db
            item1.page_fans_removes = item2.page_fans_removes; // update page_fans_removes value on db
            item1.page_fans_source_ads = item2.page_fans_source_ads; // update page_fans_source_ads value on db
            item1.page_fans_source_your_page = item2.page_fans_source_your_page; // update page_fans_source_your_page value on db
            item1.page_fans_source_others = item2.page_fans_source_others; // update page_fans_source_others value on db
            item1.pageid = item2.pageid; // update pageid value on db
            item1.save(); // save updates

            setTimeout(
              () =>
                console.log(
                  `Registro de id ${item1.id} atualizado com sucesso`
                ),
              4000
            );
          }
        })
      );
    } else {
      console.log(`Há ${newData.length} novo(s) item(s) para subir`);
      facePageSheet.addRows(newData);
      console.log(
        `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
      );
    }
  }
};

module.exports = getFacePageData;
