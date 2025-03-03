//packs
const { GoogleSpreadsheet } = require("google-spreadsheet");
const axios = require("axios");

// Initialize Google Sheets Auth
const creds = require("../../tokens/key.json");
const doc = new GoogleSpreadsheet(
  "1JlicWF4OP7qgyRXDR7UFp3zpjigT3Lx9DrqjF-8IlsU"
);

const getInstaPostData = async (pageId, token) => {
  //========================== Step 1: Getting data via API ===========================

  const url = `https://graph.facebook.com/v14.0/${pageId}/media?fields=id,timestamp,caption,media_product_type,media_type,like_count,comments_count,permalink,username&since=2025-02-01&until=2025-02-29&access_token=${token}`;

  let response = await axios.get(url);
  let data = response.data;

  //1 - storing basic data about the posts available in the media node
  let id = data.data.map((el) => el.id);
  let timestamp = data.data.map((el) => el.timestamp);
  let link = data.data.map((el) => el.permalink);
  let caption = data.data.map((el) => el.caption);
  let media_product_type = data.data.map((el) => el.media_product_type);
  let media_type = data.data.map((el) => el.media_type);
  let comments = data.data.map((el) => el.comments_count);
  let likes = data.data.map((el) => el.like_count);
  let username = data.data.map((el) => el.username);

  // 2- this class will be used to the objects on each individual IG post
  class InstaPostObject {
    constructor(
      id,
      timestamp,
      link,
      media_product_type,
      media_type,
      likes,
      comments,
      saves,
      reach,
      impressions = 0,
      video_views = 0,
      caption = null,
      username
    ) {
      this.id = id;
      this.timestamp = timestamp;
      this.link = link;
      this.media_product_type = media_product_type;
      this.media_type = media_type;
      this.likes = likes;
      this.comments = comments;
      this.saves = saves;
      this.reach = reach;
      this.impressions = impressions;
      this.video_views = video_views;
      this.caption = caption;
      this.username = username;
    }
  }

  //3 - this array will store objects which will describe each individual post based on the class InstaPost
  let instaPosts = [];

  //2 - and this array of objects with the basic data about all feed and reels posts feed e reels
  let allPosts = id.map((item, index) => {
    return {
      id: item,
      date: timestamp[index],
      link: link[index],
      caption: caption[index],
      media_product_type: media_product_type[index],
      media_type: media_type[index],
      comments: comments[index],
      likes: likes[index],
      username: username[index],
    };
  });

  // //============================================ CAROUSEL ========================================//

  //1 - generates array of objects of carousel posts
  let allCarouselPosts = allPosts.filter(
    (item) => item.media_type == "CAROUSEL_ALBUM"
  );

  //2 - function to take data from each individual carousel post
  const getCarouselPostData = async (id) => {
    let response = await axios.get(
      `https://graph.facebook.com/v14.0/${id}/insights?metric=reach,impressions,saved&access_token=${token}`
    );

    let data = response.data;

    return {
      idCarouselPost: data.data[0].id.slice(0, 17),
      reachCarouselPost: data.data[0].values[0].value,
      impressionsCarouselPost: data.data[1].values[0].value,
      savesCarouselPost: data.data[2].values[0].value,
    };
  };

  //3 - map generates array with function getCarouselPostData
  const carousel = allCarouselPosts.map(async (item) =>
    getCarouselPostData(item.id)
  );
  const carouselPostsResults = await Promise.all(carousel);

  //4 - merge both array of objects carouselPostsResults and allCarouselPosts
  let finalCarouselPosts = allCarouselPosts.map((item, index) => {
    return {
      id: item.id,
      timestamp: item.date,
      link: item.link,
      media_product_type: item.media_product_type,
      media_type: item.media_type,
      comments: item.comments,
      likes: item.likes,
      caption: item.caption,
      username: item.username,
      savesCarouselPost: carouselPostsResults[index].savesCarouselPost,
      reachCarouselPost: carouselPostsResults[index].reachCarouselPost,
      impressionsCarouselPost:
        carouselPostsResults[index].impressionsCarouselPost,
    };
  });

  //5 - storing carousel posts in  the general array instaPosts
  finalCarouselPosts.map((item) => {
    instaPosts.push(
      new InstaPostObject(
        item.id,
        item.timestamp,
        item.link,
        item.media_product_type,
        item.media_type,
        item.likes,
        item.comments,
        item.savesCarouselPost,
        item.reachCarouselPost,
        item.impressionsCarouselPost,
        (video_views = 0),
        item.caption,
        item.username
      )
    );
  });

  //============================================ SINGLE IMAGE ========================================//

  //1 - generates array of objects of single image posts
  let allImagePosts = allPosts.filter((item) => item.media_type == "IMAGE");

  //2 - function to take data from each individual image post
  const getImagePostData = async (id) => {
    let response = await axios.get(
      `https://graph.facebook.com/v14.0/${id}/insights?metric=reach,impressions,saved&access_token=${token}`
    );

    let data = response.data;

    return {
      idImagePost: data.data[0].id.slice(0, 17),
      reachImagePost: data.data[0].values[0].value,
      impressionsImagePost: data.data[1].values[0].value,
      savesImagePost: data.data[2].values[0].value,
    };
  };

  //3 - map generates array with function getCarouselPostData
  const images = allImagePosts.map(async (item) => getImagePostData(item.id));
  const imagePostsResults = await Promise.all(images);

  //4 - merge both array of objects carouselPostsResults and allCarouselPosts
  let finalImagePosts = allImagePosts.map((item, index) => {
    return {
      id: item.id,
      timestamp: item.date,
      link: item.link,
      media_product_type: item.media_product_type,
      media_type: item.media_type,
      comments: item.comments,
      likes: item.likes,
      caption: item.caption,
      username: item.username,
      savesImagePost: imagePostsResults[index].savesImagePost,
      reachImagePost: imagePostsResults[index].reachImagePost,
      impressionsImagePost: imagePostsResults[index].impressionsImagePost,
    };
  });

  //5 - storing image posts in  the general array instaPosts
  finalImagePosts.map((item) => {
    instaPosts.push(
      new InstaPostObject(
        item.id,
        item.timestamp,
        item.link,
        item.media_product_type,
        item.media_type,
        item.likes,
        item.comments,
        item.savesImagePost,
        item.reachImagePost,
        item.impressionsImagePost,
        (video_views = 0),
        item.caption,
        item.username
      )
    );
  });

  // ============================================ VIDEO ========================================//

  //1 - generates array of objects of single image posts
  let allVideoPosts = allPosts.filter((item) => item.media_type == "VIDEO");

  // 2 - function to take data from each individual video post
  const getVideoPostData = async (id) => {
    let response = await axios.get(
      `https://graph.facebook.com/v14.0/${id}/insights?metric=reach,plays,saved&access_token=${token}`
    );

    let data = response.data;

    return {
      idVideoPost: data.data[0].id.slice(0, 17),
      reachVideoPost: data.data[0].values[0].value,
      viewsVideoPost: data.data[1].values[0].value,
      savesVideoPost: data.data[2].values[0].value,
    };
  };

  //3 - map generates array with function getCarouselPostData
  const video = allVideoPosts.map(async (item) => getVideoPostData(item.id));
  const videoPostResults = await Promise.all(video);

  //4 - merge both array of objects carouselPostsResults and allCarouselPosts
  let finalVideoPosts = allVideoPosts.map((item, index) => {
    return {
      id: item.id,
      timestamp: item.date,
      link: item.link,
      media_product_type: item.media_product_type,
      media_type: item.media_type,
      comments: item.comments,
      likes: item.likes,
      caption: item.caption,
      username: item.username,
      savesVideoPost: videoPostResults[index].savesVideoPost,
      reachVideoPost: videoPostResults[index].reachVideoPost,
      viewsVideoPost: videoPostResults[index].viewsVideoPost,
    };
  });

  console.log(finalVideoPosts);

  // 5 - storing video posts in  the general array instaPosts
  finalVideoPosts.map((item) => {
    instaPosts.push(
      new InstaPostObject(
        item.id,
        item.timestamp,
        item.link,
        item.media_product_type,
        item.media_type,
        item.likes,
        item.comments,
        item.savesVideoPost,
        item.reachVideoPost,
        (impressionsImagePost = 0),
        item.playsVideoPost,
        item.caption,
        item.username
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
  const instaPageSheet = doc.sheetsByIndex[0];

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

  //verify how many NEW records there is to load
  const newData = instaPosts.filter(
    (item) => !items.find((item2) => item.id == item2.id)
  );

  // verify how many records is on the db
  if (items.length == 0) {
    console.log("A planilha esta vazia");
    instaPageSheet.addRows(newData);
    console.log(
      `O(s) novo(s) registros, no valor total de ${newData.length}, foram carregados na db com sucesso`
    );
  } else {
    console.log(
      `A tabela ${instaPageSheet.title} tem ${items.length} registros`
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
        instaPosts.some((item2) => {
          if (item1.id == item2.id) {
            item1.date = item2.timestamp; // update timestamp value on db
            item1.follow_count = item2.link; // update link value on db
            item1.profile_views = item2.media_product_type; // update media_product_type value on db
            item1.website_clicks = item2.media_type; // update media_type value on db
            item1.likes = item2.likes; // update links value on db
            item1.comments = item2.comments; // update comments value on db
            item1.saves = item2.saves; // update saves value on db
            item1.reach = item2.reach; // update reach value on db
            item1.impressions = item2.impressions; // update impressions value on db
            item1.video_views = item2.video_views; // update video_views value on db
            item1.caption = item2.caption; // update caption value on db
            item1.username = item2.username; // update username value on db
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

module.exports = getInstaPostData;
