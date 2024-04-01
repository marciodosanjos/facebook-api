//packs
const { GoogleSpreadsheet } = require("google-spreadsheet");
const axios = require("axios");

// Initialize Google Sheets Auth
const creds = require("../../tokens/key.json");
const doc = new GoogleSpreadsheet(
  "1JlicWF4OP7qgyRXDR7UFp3zpjigT3Lx9DrqjF-8IlsU"
);

const getFacePostData = async (idpage, token) => {
  //========================== Step 1: Getting data via API ===========================

  const url = `https://graph.facebook.com/v14.0/${idpage}?fields=published_posts.since(2023-02-28).until(2024-03-31){id,created_time,insights.metric(post_impressions_paid,post_impressions_paid_unique, post_impressions_organic,post_impressions_organic_unique,post_reactions_by_type_total, post_activity_by_action_type, post_clicks_by_type), message, permalink_url}&access_token=${token}`;

  //url fetch and data transform
  let response = await axios.get(url);
  let data = response.data;
  let dados = data.published_posts.data;

  let dadosFinal = [];

  class newPost {
    constructor(
      id,
      idpage,
      created_time,
      post_impressions_paid,
      post_impressions_paid_unique,
      post_impressions_organic,
      post_impressions_organic_unique,
      likes,
      shares,
      comments,
      others_clicks,
      photo_clicks,
      link_clicks,
      caption,
      url
    ) {
      this.id = id;
      this.idpage = idpage;
      this.created_time = created_time;
      this.post_impressions_paid = post_impressions_paid;
      this.post_impressions_paid_unique = post_impressions_paid_unique;
      this.post_impressions_organic = post_impressions_organic;
      this.post_impressions_organic_unique = post_impressions_organic_unique;
      this.likes = likes;
      this.shares = shares;
      this.comments = comments;
      this.others_clicks = others_clicks;
      this.photo_clicks = photo_clicks;
      this.link_clicks = link_clicks;
      this.caption = caption;
      this.url = url;
    }
  }

  dados.forEach((el) => {
    //post id and created time
    const postId = el.id;
    const createdTime = el.created_time;

    //impressions and reach
    const paidPostImpressions = el.insights.data[0].values[0].value;
    const paidPostImpressionsUnique = el.insights.data[1].values[0].value;
    const organicPostImpressions = el.insights.data[2].values[0].value;
    const organicPostImpressionsUnique = el.insights.data[3].values[0].value;

    //likes
    let likes = el.insights.data[4].values[0].value.like;
    if (likes === undefined) {
      likes = 0;
    }

    //shares
    let shares = el.insights.data[4].values[0].value.share;
    if (!shares) {
      shares = 0;
    }

    //comments
    let comments = el.insights.data[4].values[0].value.comment;
    if (!comments) {
      comments = 0;
    }

    //other clicks
    let otherClicks = el.insights.data[6].values[0].value["other clicks"];
    if (!otherClicks) {
      otherClicks = 0;
    }

    //photo clicks
    let photoClicks = el.insights.data[6].values[0].value["photo view"];
    if (!photoClicks) {
      photoClicks = 0;
    }

    //link clicks
    let linkClicks = el.insights.data[6].values[0].value["link clicks"];
    if (!linkClicks) {
      linkClicks = 0;
    }

    //caption
    let caption = el.message;

    //url
    let url = el.permalink_url;

    // send treated data to dadosFinal
    dadosFinal.push(
      new newPost(
        postId,
        idpage,
        createdTime,
        paidPostImpressions,
        paidPostImpressionsUnique,
        organicPostImpressions,
        organicPostImpressionsUnique,
        likes,
        shares,
        comments,
        otherClicks,
        photoClicks,
        linkClicks,
        caption,
        url
      )
    );
  });

  //========================== Step 2: Recording data on DB ===========================

  await doc.useServiceAccountAuth(creds);

  // loads document properties and worksheets
  await doc.loadInfo();
  console.log(doc.title);

  //   // add new sheet
  //   // const newSheet = await doc.addSheet({ title: "instapage" });

  //instanciando planilha instaposts
  const facePageSheet = doc.sheetsByIndex[2];

  //   //creating header columns
  //   await facePageSheet.setHeaderRow([
  //     "id",
  //     "idpage",
  //     "created_time",
  //     "post_impressions_paid",
  //     "post_impressions_paid_unique",
  //     "post_impressions_organic",
  //     "post_impressions_organic_unique",
  //     "likes",
  //     "shares",
  //     "comments",
  //     "others_clicks",
  //     "photo_clicks",
  //     "link_clicks",
  //     "caption",
  // 		"url"
  //   ]);

  //obtendo dados da plan
  const items = await facePageSheet.getRows();

  //verify how many NEW records there is to load
  const newData = dadosFinal.filter(
    (item) => !items.find((item2) => item.id == item2.id)
  );

  // verify how many records is on the db
  if (items.length == 0) {
    console.log("A planilha esta vazia");
    facePageSheet.addRows(newData);
    console.log(
      `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
    );
  } else {
    console.log(
      `A tabela ${facePageSheet.title} tem ${items.length} registros`
    );

    console.log(newData);

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
        dadosFinal.some((item2) => {
          if (item1.id == item2.id) {
            item1.idpage = item2.idpage; // update idpage value on db
            item1.created_time = item2.created_time; // update created_time value on db
            item1.post_impressions_paid = item2.post_impressions_paid; // update post_impressions_paid value on db
            item1.post_impressions_paid_unique =
              item2.post_impressions_paid_unique; // update post_impressions_paid_unique value on db
            item1.post_impressions_organic = item2.post_impressions_organic; // update post_impressions_organic value on db
            item1.post_impressions_organic_unique =
              item2.post_impressions_organic_unique; // update post_impressions_organic_unique value on db
            item1.likes = item2.likes; // update likes value on db
            item1.shares = item2.shares; // update shares value on db
            item1.comments = item2.comments; // update comments value on db
            item1.others_clicks = item2.others_clicks; // update others_clicks value on db
            item1.photo_clicks = item2.photo_clicks; // update photo_clicks value on db
            item1.link_clicks = item2.link_clicks; // update link_clicks value on db
            item1.caption = item2.caption; // update caption value on db
            item1.url = item2.url; // update url value on db
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

module.exports = getFacePostData;
