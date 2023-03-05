const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('FB HU BR POST LEVEL');
const ws2 = wb.addWorksheet('FB HU LATAM POST LEVEL');
const ws3 = wb.addWorksheet('FB HU BR PAGE LEVEL');
const ws4 = wb.addWorksheet('FB HU LATAM PAGE LEVEL');
const tokenFacebookBrasil = require('./token.js');
const tokenFacebookLatam = require('./tokenFbLatam.js');
const nodeSchedule = require('node-schedule');


const getDataFbBrasilPostLevel = () => {
    //defining the url params
    const params = {
        idPage: '108683005456780',
        createdTime: 'created_time',
        postImpressionsPaid: 'post_impressions_paid',
        postImpressionsPaidUnique: 'post_impressions_paid_unique',
        postImpressionsOrganic: 'post_impressions_organic',
        postImpressionsOrganicUnique: 'post_impressions_organic_unique',
        postReactionsByType: 'post_reactions_by_type_total',
        postActivityByActionType: 'post_activity_by_action_type',
        postClicksByType: 'post_clicks_by_type',
        timeIncrement: 1
    }

    //url
    const url = `https://graph.facebook.com/v14.0/${params.idPage}?fields=published_posts{id,${params.createdTime},insights.metric(${params.postImpressionsPaid},${params.postImpressionsPaidUnique}, ${params.postImpressionsOrganic},${params.postImpressionsOrganicUnique}, ${params.postReactionsByType}, ${params.postActivityByActionType}, ${params.postClicksByType})}&period=month&since=2023-02-02&access_token=${tokenFacebookBrasil}`

    // name the heading columns
    const headingColumnNames = [
        "post_id",
        "created_time",
        "post_impressions_paid",
        "post_impressions_paid_unique",
        "post_impressions_organic",
        "post_impressions_organic_unique",
        "likes",
        "shares",
        "comments",
        "other_clicks",
        "photo_clicks",
        "link_clicks"
    ]

    //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });

    //url request and data transform
    fetch(url)
        .then(resp => resp.json())
        .then(data => {

            let dados = data.published_posts.data
            let dadosFinal = [];

            class newPost {
                constructor(id, created_time, post_impressions_paid, post_impressions_paid_unique, post_impressions_organic, post_impressions_organic_unique, likes, shares, comments, othersClicks, photoClicks, linkClicks) {
                    this.id = id
                    this.created_time = created_time
                    this.post_impressions_paid = post_impressions_paid
                    this.post_impressions_paid_unique = post_impressions_paid_unique
                    this.post_impressions_organic = post_impressions_organic
                    this.post_impressions_organic_unique = post_impressions_organic_unique
                    this.likes = likes
                    this.shares = shares
                    this.comments = comments
                    this.othersClicks = othersClicks
                    this.photoClicks = photoClicks
                    this.linkClicks = linkClicks
                }
            }

            dados.forEach(el => {

                //getting post id and created time
                const postId = el.id
                const createdTime = el.created_time

                //impressions and reach
                const paidPostImpressions = el.insights.data[0].values[0].value.toString()
                const paidPostImpressionsUnique = el.insights.data[1].values[0].value.toString()
                const organicPostImpressions = el.insights.data[2].values[0].value.toString()
                const organicPostImpressionsUnique = el.insights.data[3].values[0].value.toString()

                //likes
                let likes = el.insights.data[4].values[0].value.like
                if (likes === undefined) {
                    likes = 0
                }
                likesToString = likes.toString()

                //shares
                let shares = el.insights.data[4].values[0].value.share
                if (!shares) {
                    shares = 0
                }
                sharesToString = shares.toString()

                //comments
                let comments = el.insights.data[4].values[0].value.comment
                if (!comments) {
                    comments = 0
                }
                commentsToString = comments.toString()

                //other clicks
                let otherClicks = el.insights.data[6].values[0].value["other clicks"]
                if (!otherClicks) {
                    otherClicks = 0
                }
                otherClicksToString = otherClicks.toString()

                //photo clicks
                let photoClicks = el.insights.data[6].values[0].value["photo view"]
                if (!photoClicks) {
                    photoClicks = 0
                }
                let photoClicksToString = photoClicks.toString()

                //link clicks
                let linkClicks = el.insights.data[6].values[0].value["link clicks"]
                if (!linkClicks) {
                    linkClicks = 0
                }
                let linkClicksToString = linkClicks.toString()

                // send treated data to dadosFinal
                dadosFinal.push(new newPost(postId, createdTime, paidPostImpressions, paidPostImpressionsUnique, organicPostImpressions, organicPostImpressionsUnique, likesToString, sharesToString, commentsToString, otherClicksToString, photoClicksToString, linkClicksToString))
            })


            // Write Data in Excel file
            let rowIndex = 2;
            dadosFinal.forEach(record => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                    ws.cell(rowIndex, columnIndex++)
                        .string(record[columnName])


                });
                rowIndex++;
            });

            wb.write('hu-dataset-2023.xlsx');
        })

}
getDataFbBrasilPostLevel()

const getDataFbLatamPostLevel = () => {

    //defining the url params
    const params = {
        idPage: '260411577472305',
        createdTime: 'created_time',
        postImpressionsPaid: 'post_impressions_paid',
        postImpressionsPaidUnique: 'post_impressions_paid_unique',
        postImpressionsOrganic: 'post_impressions_organic',
        postImpressionsOrganicUnique: 'post_impressions_organic_unique',
        postReactionsByType: 'post_reactions_by_type_total',
        postActivityByActionType: 'post_activity_by_action_type',
        postClicksByType: 'post_clicks_by_type',
        timeIncrement: 1
    }

    //url
    const url = `https://graph.facebook.com/v14.0/${params.idPage}?fields=published_posts{id,${params.createdTime},insights.metric(${params.postImpressionsPaid},${params.postImpressionsPaidUnique}, ${params.postImpressionsOrganic},${params.postImpressionsOrganicUnique}, ${params.postReactionsByType}, ${params.postActivityByActionType}, ${params.postClicksByType})}&period=month&since=2023-02-02&access_token=${tokenFacebookLatam}`

    // name the heading columns
    const headingColumnNames = [
        "post_id",
        "created_time",
        "post_impressions_paid",
        "post_impressions_paid_unique",
        "post_impressions_organic",
        "post_impressions_organic_unique",
        "likes",
        "shares",
        "comments",
        "other_clicks",
        "photo_clicks",
        "link_clicks"
    ]

    //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws2.cell(1, headingColumnIndex++)
            .string(heading)
    });

    //url request and data transform
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            let dados = data.published_posts.data
            let dadosFinal = [];

            class newPost {
                constructor(id, created_time, post_impressions_paid, post_impressions_paid_unique, post_impressions_organic, post_impressions_organic_unique, likes, shares, comments, othersClicks, photoClicks, linkClicks) {
                    this.id = id
                    this.created_time = created_time
                    this.post_impressions_paid = post_impressions_paid
                    this.post_impressions_paid_unique = post_impressions_paid_unique
                    this.post_impressions_organic = post_impressions_organic
                    this.post_impressions_organic_unique = post_impressions_organic_unique
                    this.likes = likes
                    this.shares = shares
                    this.comments = comments
                    this.othersClicks = othersClicks
                    this.photoClicks = photoClicks
                    this.linkClicks = linkClicks
                }
            }

            dados.forEach(el => {

                //getting post id and created time
                const postId = el.id
                const createdTime = el.created_time

                //impressions and reach
                const paidPostImpressions = el.insights.data[0].values[0].value.toString()
                const paidPostImpressionsUnique = el.insights.data[1].values[0].value.toString()
                const organicPostImpressions = el.insights.data[2].values[0].value.toString()
                const organicPostImpressionsUnique = el.insights.data[3].values[0].value.toString()

                //likes
                let likes = el.insights.data[4].values[0].value.like
                if (likes === undefined) {
                    likes = 0
                }
                likesToString = likes.toString()

                //shares
                let shares = el.insights.data[4].values[0].value.share
                if (!shares) {
                    shares = 0
                }
                sharesToString = shares.toString()

                //comments
                let comments = el.insights.data[4].values[0].value.comment
                if (!comments) {
                    comments = 0
                }
                commentsToString = comments.toString()

                //other clicks
                let otherClicks = el.insights.data[6].values[0].value["other clicks"]
                if (!otherClicks) {
                    otherClicks = 0
                }
                otherClicksToString = otherClicks.toString()

                //photo clicks
                let photoClicks = el.insights.data[6].values[0].value["photo view"]
                if (!photoClicks) {
                    photoClicks = 0
                }
                let photoClicksToString = photoClicks.toString()

                //link clicks
                let linkClicks = el.insights.data[6].values[0].value["link clicks"]
                if (!linkClicks) {
                    linkClicks = 0
                }
                let linkClicksToString = linkClicks.toString()


                // send treated data to dadosFinal
                dadosFinal.push(new newPost(postId, createdTime, paidPostImpressions, paidPostImpressionsUnique, organicPostImpressions, organicPostImpressionsUnique, likesToString, sharesToString, commentsToString, otherClicksToString, photoClicksToString, linkClicksToString))
            })


            // Write Data in Excel file
            let rowIndex = 2;
            dadosFinal.forEach(record => {
                let columnIndex = 1;
                Object.keys(record).forEach(columnName => {
                    ws2.cell(rowIndex, columnIndex++)
                        .string(record[columnName])


                });
                rowIndex++;
            });

            wb.write('hu-dataset-2023.xlsx');
        })

}
getDataFbLatamPostLevel()

const getDataFbBrasilPageLevel = () => {

    //defining the url params
    const params = {
        idPage: '108683005456780',
        createdTime: 'created_time',
        postImpressionsPaid: 'post_impressions_paid',
        postImpressionsPaidUnique: 'post_impressions_paid_unique',
        postImpressionsOrganic: 'post_impressions_organic',
        postImpressionsOrganicUnique: 'post_impressions_organic_unique',
        postReactionsByType: 'post_reactions_by_type_total',
        postActivityByActionType: 'post_activity_by_action_type',
        postClicksByType: 'post_clicks_by_type',
        timeIncrement: 1
    }

    //url
    const url = "https://graph.facebook.com/v14.0/108683005456780/insights?metric=page_posts_impressions_paid,page_posts_impressions_paid_unique, page_posts_impressions_organic,page_posts_impressions_organic_unique, page_engaged_users, page_total_actions, page_post_engagements, page_consumptions_by_consumption_type, page_fan_adds_by_paid_non_paid_unique,page_actions_post_reactions_total,page_fans, page_fans_city, page_fans_country, page_fans_gender_age,page_fan_adds, page_fan_removes, page_fans_by_like_source&since=2023-02-01&period=day&access_token=EAAKp4M8mbCgBAJVPL52Q1M3aVRePnJQzR8ZBiZAT4qSWMS5nBsA0TwrSh8ktAl9BTAeAPQ9jiwWN9G9wsTepJCMqmZBeBkCKV6AWpOPwjKUrZA5ZAcXLQteLieQVLkpw8CMjegP5IdkX0IdYujEdNb8TUQddplSxx4LELZBedio4NBM35dopsN41AZByyD9LeUZD"

    // name the heading columns
    const headingColumnNames = [
        "date",
        "page_posts_impressions_paid",
        "page_posts_impressions_paid_unique",
        "page_posts_impressions_organic",
        "page_posts_impressions_organic_unique",
        "page_engaged_users",
        "page_total_actions",
        "page_post_engagements",
        "link_clicks",
        "clicks_video_play",
        "other_clicks",
        "new_page_fans_paid",
        "new_page_fans_organic",
        "likes",
        "loves",
        "page_fans",
        "page_fan_adds",
        "page_fan_removes",
        "page_fans_source_ads",
        "page_fans_source_your_page",
        "page_fans_source_other_sources",
        "page_fan_age M.25-34",
        "page_fan_age F.55-64",
        "page_fan_age M.55-64",
        "page_fan_age F.35-44",
        "page_fan_age F.45-54",
        "page_fan_age M.35-44",
        "page_fan_age M.45-54",
        "page_fan_age F.18-24",
        "page_fan_age F.25-34",
    ]

    //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws3.cell(1, headingColumnIndex++)
            .string(heading)
    });

    //url request and data transform all fields and metrics
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            const dados = data.data;

            const sendDataExcel = () => {
                //date
                const date = [];
                dados.map(el => {
                    const rawValues = el.values;
                    date.push(rawValues.map(el => el.end_time));
                })
                const finalDate = date[0]

                //page_posts_impressions_paid
                const rawImp = data.data[0].values;
                const paidImpressions = rawImp.map(el => el.value);
                const paidImpressionsFInal = paidImpressions.map(el => el.toString());

                //page_posts_impressions_paid_unique
                const rawImpUnique = data.data[1].values;
                const paidImpressionsUnique = rawImpUnique.map(el => el.value);
                const paidImpressionsUniqueFInal = paidImpressionsUnique.map(el => el.toString());

                //page_posts_impressions_organic
                const rawOrgImp = data.data[2].values;
                const organicImpressions = rawOrgImp.map(el => el.value);
                const organicImpressionsFinal = organicImpressions.map(el => el.toString());

                //page_posts_impressions_organic_unique
                const rawOrgImpUnique = data.data[3].values;
                const organicImpressionsUnique = rawOrgImpUnique.map(el => el.value);
                const organicImpressionsUniqueFinal = organicImpressionsUnique.map(el => el.toString());

                //page_engaged_users
                const rawEngagedUsers = data.data[4].values;
                const engagedUsers = rawEngagedUsers.map(el => el.value);
                const engagedUsersFinal = engagedUsers.map(el => el.toString());

                //page_total_actions
                const rawTotalActions = data.data[5].values;
                const totalActions = rawTotalActions.map(el => el.value);
                const totalActionsFinal = totalActions.map(el => el.toString());

                //page_post_engagements
                const rawEngagements = data.data[6].values;
                const engagements = rawEngagements.map(el => el.value);
                const engagementsFinal = engagements.map(el => el.toString());

                //link_clicks
                const rawLinkClicks = data.data[7].values;
                const linkClicks = rawLinkClicks.map(el => el.value["link clicks"] == undefined ? 0 : el.value["link clicks"]);
                const linkClicksFinal = linkClicks.map(el => el.toString())

                //clicks_video_play
                const videoPlayClicks = rawLinkClicks.map(el => el.value["video play"] == undefined ? 0 : el.value["video play"]);
                const videoPlayClicksFinal = videoPlayClicks.map(el => el.toString())

                //other_clicks
                const otherClicks = rawLinkClicks.map(el => el.value["other clicks"] == undefined ? 0 : el.value["other clicks"]);
                const otherClicksFinal = otherClicks.map(el => el.toString())

                //new_page_fans_paid
                const rawPageFansPaid = data.data[8].values;
                const pageFansPaid = rawPageFansPaid.map(el => el.value["paid"] == undefined ? 0 : el.value["paid"]);
                const pageFansPaidFinal = pageFansPaid.map(el => el.toString())

                //new_page_fans_organic
                const pageFansOrganic = rawPageFansPaid.map(el => el.value["unpaid"] == undefined ? 0 : el.value["unpaid"]);
                const pageFansOrganicFinal = pageFansOrganic.map(el => el.toString())

                //likes
                const postReactions = data.data[9].values;
                const likes = postReactions.map(el => el.value["like"] == undefined ? 0 : el.value["like"]);
                const likesFinal = likes.map(el => el.toString())

                //reaction loves becomed in the posts
                const loves = postReactions.map(el => el.value["love"] == undefined ? 0 : el.value["love"]);
                const lovesFinal = loves.map(el => el.toString())

                //page_fans: Lifetime Total Likes
                const rawpageFans = data.data[10].values;
                const pageFans = rawpageFans.map(el => el.value);
                const pageFansFinal = pageFans.map(el => el.toString());

                //page_fan_adds: Daily New Likes
                const rawpageFansAdds = data.data[11].values;
                const pageFansAdds = rawpageFansAdds.map(el => el.value);
                const pageFansAddsFinal = pageFansAdds.map(el => el.toString());

                //page_fan_removes: Daily Unlikes
                const rawpageFansRemoves = data.data[12].values;
                const pageFansRemoves = rawpageFansRemoves.map(el => el.value);
                const pageFansRemovesFinal = pageFansRemoves.map(el => el.toString());

                //page_fans_ads: Daily Like Sources from page fan coming from Ads
                const rawpageFansAds = data.data[13].values;
                const pageFansAds = rawpageFansAds.map(el => el.value["Ads"] == undefined ? 0 : el.value["Ads"]);
                const pageFansAdsFinal = pageFansAds.map(el => el.toString())

                //page_fans_page: Daily Like Sources from fan coming from the owned Page
                const pageFansYourPage = rawpageFansAds.map(el => el.value["Your Page"] == undefined ? 0 : el.value["Your Page"]);
                const pageFansPageYourPage = pageFansYourPage.map(el => el.toString())

                //page_fans_page: Daily Like Sources from fan coming from other sources
                const pageFansSourceOthers = rawpageFansAds.map(el => el.value["Other"] == undefined ? 0 : el.value["Other"]);
                const pageFansSourceOthersFinal = pageFansSourceOthers.map(el => el.toString())

                //page_fans_gender_age: Daily age range from facebook fans

                //M2534
                const rawpageFansAge = data.data[15].values;
                const rawpageFansAgeM2534 = rawpageFansAge.map(el => el.value["M.25-34"] == undefined ? 0 : el.value["M.25-34"]);
                const rawpageFansAgeM2534Final = rawpageFansAgeM2534.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    rawpageFansAgeM2534Final.unshift('0')
                }

                //Female between 55 and 64
                const page_fan_ageF5564 = rawpageFansAge.map(el => el.value["F.55-64"] == undefined ? 0 : el.value["F.55-64"]);
                const rawpageFansAgeF5564Final = page_fan_ageF5564.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    rawpageFansAgeF5564Final.unshift('0')
                }

                //Men between 55 and 64
                const page_fan_ageM5564 = rawpageFansAge.map(el => el.value["M.55-64"] == undefined ? 0 : el.value["M.55-64"]);
                const rawpageFansAgeM5564Final = page_fan_ageM5564.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    rawpageFansAgeM5564Final.unshift('0')
                }

                //Female between 35 and 44
                const page_fan_ageF3544 = rawpageFansAge.map(el => el.value["F.35-44"] == undefined ? 0 : el.value["F.35-44"]);
                const page_fan_ageF3544Final = page_fan_ageF3544.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF3544Final.unshift('0')
                }

                //Female between 45 and 54
                const page_fan_ageF4554 = rawpageFansAge.map(el => el.value["F.45-54"] == undefined ? 0 : el.value["F.45-54"]);
                const page_fan_ageF4554Final = page_fan_ageF4554.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF4554Final.unshift('0')
                }

                //Men between 35 and 44
                const page_fan_ageM3544 = rawpageFansAge.map(el => el.value["M.35-44"] == undefined ? 0 : el.value["M.35-44"]);
                const page_fan_ageM3544Final = page_fan_ageM3544.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageM3544Final.unshift('0')
                }

                //Men between 45 and 54
                const page_fan_ageM4554 = rawpageFansAge.map(el => el.value["M.45-54"] == undefined ? 0 : el.value["M.45-54"]);
                const page_fan_ageM4554Final = page_fan_ageM4554.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageM4554Final.unshift('0')
                }

                //Female between 18 and 24
                const page_fan_ageF1824 = rawpageFansAge.map(el => el.value["F.18-24"] == undefined ? 0 : el.value["F.18-24"]);
                const page_fan_ageF1824Final = page_fan_ageF1824.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF1824Final.unshift('0')
                }

                //Female between 25 and 34
                const page_fan_ageF2534 = rawpageFansAge.map(el => el.value["F.25-34"] == undefined ? 0 : el.value["F.25-34"]);
                const page_fan_ageF2534Final = page_fan_ageF2534.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF2534Final.unshift('0')
                }

                //send data to array of objects
                const posts = finalDate.map((item, index) => {
                    return {
                        date: item,
                        paid_impressions: paidImpressionsFInal[index],
                        paid_impressions_unique: paidImpressionsUniqueFInal[index],
                        organic_impressions: organicImpressionsFinal[index],
                        impressions_organic_unique: organicImpressionsUniqueFinal[index],
                        engaged_users: engagedUsersFinal[index],
                        total_actions: totalActionsFinal[index],
                        engagements: engagementsFinal[index],
                        link_clicks: linkClicksFinal[index],
                        video_play_clicks: videoPlayClicksFinal[index],
                        other_clicks: otherClicksFinal[index],
                        page_fans_paid: pageFansPaidFinal[index],
                        new_page_fans_organic: pageFansOrganicFinal[index],
                        likes: likesFinal[index],
                        loves: lovesFinal[index],
                        page_fans: pageFansFinal[index],
                        page_fans_adds: pageFansAddsFinal[index],
                        page_fans_removes: pageFansRemovesFinal[index],
                        page_fans_source_ads: pageFansAdsFinal[index],
                        page_fans_source_your_page: pageFansPageYourPage[index],
                        page_fans_source_others: pageFansSourceOthersFinal[index],
                        page_fan_ageM2534: rawpageFansAgeM2534Final[index],
                        page_fan_ageF5564: rawpageFansAgeF5564Final[index],
                        page_fan_ageM5564: rawpageFansAgeM5564Final[index],
                        page_fan_ageF3544: page_fan_ageF3544Final[index],
                        page_fan_ageF4554: page_fan_ageF4554Final[index],
                        page_fan_ageM3544: page_fan_ageM3544Final[index],
                        page_fan_ageM4554: page_fan_ageM4554Final[index],
                        page_fan_ageF1824: page_fan_ageF1824Final[index],
                        page_fan_ageF2534: page_fan_ageF2534Final[index]

                    }
                })

                // Write all Data in Excel file
                let rowIndex = 2;
                posts.forEach(record => {
                    let columnIndex = 1;
                    Object.keys(record).forEach(columnName => {
                        ws3.cell(rowIndex, columnIndex++)
                            .string(record[columnName])
                    });
                    rowIndex++;
                });

            }

            sendDataExcel()
            wb.write('hu-dataset-2023.xlsx');
        })

}
getDataFbBrasilPageLevel()

const getDataFbLatamPageLevel = () => {

    //defining the url params
    const params = {
        idPage: '108683005456780',
        createdTime: 'created_time',
        postImpressionsPaid: 'post_impressions_paid',
        postImpressionsPaidUnique: 'post_impressions_paid_unique',
        postImpressionsOrganic: 'post_impressions_organic',
        postImpressionsOrganicUnique: 'post_impressions_organic_unique',
        postReactionsByType: 'post_reactions_by_type_total',
        postActivityByActionType: 'post_activity_by_action_type',
        postClicksByType: 'post_clicks_by_type',
        timeIncrement: 1
    }

    //url
    const url = `https://graph.facebook.com/v14.0/260411577472305/insights?metric=page_posts_impressions_paid,page_posts_impressions_paid_unique, page_posts_impressions_organic,page_posts_impressions_organic_unique, page_engaged_users, page_total_actions, page_post_engagements, page_consumptions_by_consumption_type, page_fan_adds_by_paid_non_paid_unique,page_actions_post_reactions_total,page_fans, page_fans_city, page_fans_country, page_fans_gender_age,page_fan_adds, page_fan_removes, page_fans_by_like_source&since=2023-02-01&period=day&access_token=${tokenFacebookLatam}`

    // name the heading columns
    const headingColumnNames = [
        "date",
        "page_posts_impressions_paid",
        "page_posts_impressions_paid_unique",
        "page_posts_impressions_organic",
        "page_posts_impressions_organic_unique",
        "page_engaged_users",
        "page_total_actions",
        "page_post_engagements",
        "link_clicks",
        "clicks_video_play",
        "other_clicks",
        "new_page_fans_paid",
        "new_page_fans_organic",
        "likes",
        "loves",
        "page_fans",
        "page_fan_adds",
        "page_fan_removes",
        "page_fans_source_ads",
        "page_fans_source_your_page",
        "page_fans_source_other_sources",
        "page_fan_age M.25-34",
        "page_fan_age F.55-64",
        "page_fan_age M.55-64",
        "page_fan_age F.35-44",
        "page_fan_age F.45-54",
        "page_fan_age M.35-44",
        "page_fan_age M.45-54",
        "page_fan_age F.18-24",
        "page_fan_age F.25-34",
    ]

    //Write Column Title in Excel file
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws4.cell(1, headingColumnIndex++)
            .string(heading)
    });

    //url request and data transform all fields and metrics
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            const dados = data.data;

            const sendDataExcel = () => {
                //date
                const date = [];
                dados.map(el => {
                    const rawValues = el.values;
                    date.push(rawValues.map(el => el.end_time));
                })
                const finalDate = date[0]

                //page_posts_impressions_paid
                const rawImp = data.data[0].values;
                const paidImpressions = rawImp.map(el => el.value);
                const paidImpressionsFInal = paidImpressions.map(el => el.toString());

                //page_posts_impressions_paid_unique
                const rawImpUnique = data.data[1].values;
                const paidImpressionsUnique = rawImpUnique.map(el => el.value);
                const paidImpressionsUniqueFInal = paidImpressionsUnique.map(el => el.toString());

                //page_posts_impressions_organic
                const rawOrgImp = data.data[2].values;
                const organicImpressions = rawOrgImp.map(el => el.value);
                const organicImpressionsFinal = organicImpressions.map(el => el.toString());

                //page_posts_impressions_organic_unique
                const rawOrgImpUnique = data.data[3].values;
                const organicImpressionsUnique = rawOrgImpUnique.map(el => el.value);
                const organicImpressionsUniqueFinal = organicImpressionsUnique.map(el => el.toString());

                //page_engaged_users
                const rawEngagedUsers = data.data[4].values;
                const engagedUsers = rawEngagedUsers.map(el => el.value);
                const engagedUsersFinal = engagedUsers.map(el => el.toString());

                //page_total_actions
                const rawTotalActions = data.data[5].values;
                const totalActions = rawTotalActions.map(el => el.value);
                const totalActionsFinal = totalActions.map(el => el.toString());

                //page_post_engagements
                const rawEngagements = data.data[6].values;
                const engagements = rawEngagements.map(el => el.value);
                const engagementsFinal = engagements.map(el => el.toString());

                //link_clicks
                const rawLinkClicks = data.data[7].values;
                const linkClicks = rawLinkClicks.map(el => el.value["link clicks"] == undefined ? 0 : el.value["link clicks"]);
                const linkClicksFinal = linkClicks.map(el => el.toString())

                //clicks_video_play
                const videoPlayClicks = rawLinkClicks.map(el => el.value["video play"] == undefined ? 0 : el.value["video play"]);
                const videoPlayClicksFinal = videoPlayClicks.map(el => el.toString())

                //other_clicks
                const otherClicks = rawLinkClicks.map(el => el.value["other clicks"] == undefined ? 0 : el.value["other clicks"]);
                const otherClicksFinal = otherClicks.map(el => el.toString())

                //new_page_fans_paid
                const rawPageFansPaid = data.data[8].values;
                const pageFansPaid = rawPageFansPaid.map(el => el.value["paid"] == undefined ? 0 : el.value["paid"]);
                const pageFansPaidFinal = pageFansPaid.map(el => el.toString())

                //new_page_fans_organic
                const pageFansOrganic = rawPageFansPaid.map(el => el.value["unpaid"] == undefined ? 0 : el.value["unpaid"]);
                const pageFansOrganicFinal = pageFansOrganic.map(el => el.toString())

                //likes
                const postReactions = data.data[9].values;
                const likes = postReactions.map(el => el.value["like"] == undefined ? 0 : el.value["like"]);
                const likesFinal = likes.map(el => el.toString())

                //reaction loves becomed in the posts
                const loves = postReactions.map(el => el.value["love"] == undefined ? 0 : el.value["love"]);
                const lovesFinal = loves.map(el => el.toString())

                //page_fans: Lifetime Total Likes
                const rawpageFans = data.data[10].values;
                const pageFans = rawpageFans.map(el => el.value);
                const pageFansFinal = pageFans.map(el => el.toString());

                //page_fan_adds: Daily New Likes
                const rawpageFansAdds = data.data[11].values;
                const pageFansAdds = rawpageFansAdds.map(el => el.value);
                const pageFansAddsFinal = pageFansAdds.map(el => el.toString());

                //page_fan_removes: Daily Unlikes
                const rawpageFansRemoves = data.data[12].values;
                const pageFansRemoves = rawpageFansRemoves.map(el => el.value);
                const pageFansRemovesFinal = pageFansRemoves.map(el => el.toString());

                //page_fans_ads: Daily Like Sources from page fan coming from Ads
                const rawpageFansAds = data.data[13].values;
                const pageFansAds = rawpageFansAds.map(el => el.value["Ads"] == undefined ? 0 : el.value["Ads"]);
                const pageFansAdsFinal = pageFansAds.map(el => el.toString())

                //page_fans_page: Daily Like Sources from fan coming from the owned Page
                const pageFansYourPage = rawpageFansAds.map(el => el.value["Your Page"] == undefined ? 0 : el.value["Your Page"]);
                const pageFansPageYourPage = pageFansYourPage.map(el => el.toString())

                //page_fans_page: Daily Like Sources from fan coming from other sources
                const pageFansSourceOthers = rawpageFansAds.map(el => el.value["Other"] == undefined ? 0 : el.value["Other"]);
                const pageFansSourceOthersFinal = pageFansSourceOthers.map(el => el.toString())

                //page_fans_gender_age: Daily age range from facebook fans

                //M2534
                const rawpageFansAge = data.data[15].values;
                const rawpageFansAgeM2534 = rawpageFansAge.map(el => el.value["M.25-34"] == undefined ? 0 : el.value["M.25-34"]);
                const rawpageFansAgeM2534Final = rawpageFansAgeM2534.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    rawpageFansAgeM2534Final.unshift('0')
                }

                //Female between 55 and 64
                const page_fan_ageF5564 = rawpageFansAge.map(el => el.value["F.55-64"] == undefined ? 0 : el.value["F.55-64"]);
                const rawpageFansAgeF5564Final = page_fan_ageF5564.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    rawpageFansAgeF5564Final.unshift('0')
                }

                //Men between 55 and 64
                const page_fan_ageM5564 = rawpageFansAge.map(el => el.value["M.55-64"] == undefined ? 0 : el.value["M.55-64"]);
                const rawpageFansAgeM5564Final = page_fan_ageM5564.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    rawpageFansAgeM5564Final.unshift('0')
                }

                //Female between 35 and 44
                const page_fan_ageF3544 = rawpageFansAge.map(el => el.value["F.35-44"] == undefined ? 0 : el.value["F.35-44"]);
                const page_fan_ageF3544Final = page_fan_ageF3544.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF3544Final.unshift('0')
                }

                //Female between 45 and 54
                const page_fan_ageF4554 = rawpageFansAge.map(el => el.value["F.45-54"] == undefined ? 0 : el.value["F.45-54"]);
                const page_fan_ageF4554Final = page_fan_ageF4554.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF4554Final.unshift('0')
                }

                //Men between 35 and 44
                const page_fan_ageM3544 = rawpageFansAge.map(el => el.value["M.35-44"] == undefined ? 0 : el.value["M.35-44"]);
                const page_fan_ageM3544Final = page_fan_ageM3544.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageM3544Final.unshift('0')
                }

                //Men between 45 and 54
                const page_fan_ageM4554 = rawpageFansAge.map(el => el.value["M.45-54"] == undefined ? 0 : el.value["M.45-54"]);
                const page_fan_ageM4554Final = page_fan_ageM4554.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageM4554Final.unshift('0')
                }

                //Female between 18 and 24
                const page_fan_ageF1824 = rawpageFansAge.map(el => el.value["F.18-24"] == undefined ? 0 : el.value["F.18-24"]);
                const page_fan_ageF1824Final = page_fan_ageF1824.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF1824Final.unshift('0')
                }

                //Female between 25 and 34
                const page_fan_ageF2534 = rawpageFansAge.map(el => el.value["F.25-34"] == undefined ? 0 : el.value["F.25-34"]);
                const page_fan_ageF2534Final = page_fan_ageF2534.map(el => el.toString());
                for (let index = 0; index < 19; index++) {
                    page_fan_ageF2534Final.unshift('0')
                }

                //send data to array of objects
                const posts = finalDate.map((item, index) => {
                    return {
                        date: item,
                        paid_impressions: paidImpressionsFInal[index],
                        paid_impressions_unique: paidImpressionsUniqueFInal[index],
                        organic_impressions: organicImpressionsFinal[index],
                        impressions_organic_unique: organicImpressionsUniqueFinal[index],
                        engaged_users: engagedUsersFinal[index],
                        total_actions: totalActionsFinal[index],
                        engagements: engagementsFinal[index],
                        link_clicks: linkClicksFinal[index],
                        video_play_clicks: videoPlayClicksFinal[index],
                        other_clicks: otherClicksFinal[index],
                        page_fans_paid: pageFansPaidFinal[index],
                        new_page_fans_organic: pageFansOrganicFinal[index],
                        likes: likesFinal[index],
                        loves: lovesFinal[index],
                        page_fans: pageFansFinal[index],
                        page_fans_adds: pageFansAddsFinal[index],
                        page_fans_removes: pageFansRemovesFinal[index],
                        page_fans_source_ads: pageFansAdsFinal[index],
                        page_fans_source_your_page: pageFansPageYourPage[index],
                        page_fans_source_others: pageFansSourceOthersFinal[index],
                        page_fan_ageM2534: rawpageFansAgeM2534Final[index],
                        page_fan_ageF5564: rawpageFansAgeF5564Final[index],
                        page_fan_ageM5564: rawpageFansAgeM5564Final[index],
                        page_fan_ageF3544: page_fan_ageF3544Final[index],
                        page_fan_ageF4554: page_fan_ageF4554Final[index],
                        page_fan_ageM3544: page_fan_ageM3544Final[index],
                        page_fan_ageM4554: page_fan_ageM4554Final[index],
                        page_fan_ageF1824: page_fan_ageF1824Final[index],
                        page_fan_ageF2534: page_fan_ageF2534Final[index]

                    }
                })

                // Write all Data in Excel file
                let rowIndex = 2;
                posts.forEach(record => {
                    let columnIndex = 1;
                    Object.keys(record).forEach(columnName => {
                        ws4.cell(rowIndex, columnIndex++)
                            .string(record[columnName])
                    });
                    rowIndex++;
                });

            }

            sendDataExcel()
            wb.write('hu-dataset-2023.xlsx');
        })

}
getDataFbLatamPageLevel()




// // const rule = new nodeSchedule.RecurrenceRule();
// // rule.dayOfWeek = [0, new schedule.Range(0, 3)];

// const job = nodeSchedule.scheduleJob({
//     hour: 18,
//     minute: 20,
//     dayOfWeek: 0
// }, getData)

// console.log(job.nextInvocation());