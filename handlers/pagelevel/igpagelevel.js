//packs
const { GoogleSpreadsheet } = require("google-spreadsheet");
const axios = require("axios");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

// Initialize Google Sheets Auth
const creds = require("../../tokens/key.json");
const doc = new GoogleSpreadsheet(
  "1JlicWF4OP7qgyRXDR7UFp3zpjigT3Lx9DrqjF-8IlsU"
);

const getInstaPageData = async (pageId, token) => {
  //========================== Step 1: Getting data via API ===========================

  const url = `https://graph.facebook.com/v14.0/${pageId}/insights?metric=follower_count, profile_views, website_clicks&period=day&since=2024-12-03&until=2025-01-01&access_token=${token}`;

  let response = await axios.get(url);

  let data = response.data.data;

  //date
  let date = data[0].values.map((el) => el.end_time);
  //followers
  let follow_count = data[0].values.map((el) => el.value);
  //profile views
  let profile_views = data[1].values.map((el) => el.value);
  //website_clicks
  let website_clicks = data[2].values.map((el) => el.value);

  //2 - storing in this array of objects the basic data about the page
  let result = date.map((item, index) => {
    return {
      id:
        follow_count[index] * 976245695 +
        website_clicks[index] * 455687456 +
        profile_views[index] * 37234532 +
        new Date().getFullYear(),
      date: item,
      follow_count: follow_count[index],
      profile_views: profile_views[index],
      website_clicks: website_clicks[index],
      page_id: pageId,
    };
  });

  //========================== Step 2: Recording data on DB ===========================
  await doc.useServiceAccountAuth(creds);

  // loads document properties and worksheets
  await doc.loadInfo();
  console.log(doc.title);

  //   // add new sheet
  //   // const newSheet = await doc.addSheet({ title: "instapage" });

  //instanciando planilha instaposts
  const instaPageSheet = doc.sheetsByIndex[1];

  //   //creating header columns
  //   await instaPageSheet.setHeaderRow([
  //     "id",
  //     "date",
  //     "follow_count",
  //     "profile_views",
  //     "website_clicks",
  //     "page_id",
  //   ]);

  //obtendo dados da plan
  const items = await instaPageSheet.getRows();

  // verify how many records is on the db
  if (items.length == 0) {
    console.log("A planilha esta vazia");
  } else {
    console.log(
      `A tabela ${instaPageSheet.title} tem ${items.length} registros`
    );

    //verify how many NEW records there is to load
    const newData = result.filter(
      (item) =>
        !items.find(
          (item2) => item.id == item2.id && item.page_id == item2.page_id
        )
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

      // update current row values if ID the same
      currentRows = items.filter((item1) =>
        result.some((item2) => {
          if (item1.id == item2.id) {
            item1.date = item2.date; // update date value
            item1.follow_count = item2.follow_count; // update follow_count value
            item1.profile_views = item2.profile_views; // update profile_views value
            item1.website_clicks = item2.website_clicks; // update website_clicks value
            item1.page_id = item2.page_id; // update page_id value
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
      instaPageSheet.addRows(newData);
      console.log(
        `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
      );
    }
  }
};

module.exports = getInstaPageData;
