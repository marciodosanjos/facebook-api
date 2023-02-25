const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('FB HU BR');
const ws2 = wb.addWorksheet('FB HU LATAM');
const token = require('./token.js');


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
const url = `https://graph.facebook.com/v14.0/${params.idPage}?fields=published_posts{id,${params.createdTime},insights.metric(${params.postImpressionsPaid},${params.postImpressionsPaidUnique}, ${params.postImpressionsOrganic},${params.postImpressionsOrganicUnique}, ${params.postReactionsByType}, ${params.postActivityByActionType}, ${params.postClicksByType})}&since=2023-02-02&access_token=${token}`

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
        console.log(data)
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
            console.log(postId, linkClicksToString)

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