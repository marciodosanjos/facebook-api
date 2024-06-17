const fs = require("fs");
const { google } = require("googleapis");
const readline = require("readline");
const credentialsGoogle = require("../../tokens/credentials.json");

const googleAPI = () => {
  // Carregar o arquivo de credenciais
  const credentials = credentialsGoogle;

  // Definir o escopo da API que você deseja acessar
  const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

  // Criar uma instância do OAuth2Client
  const { client_secret, client_id } = credentials.web;
  const redirect_uris = ["http://localhost"];
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Função para obter um novo token
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error retrieving access token", err);
        oAuth2Client.setCredentials(token);
        // Salvar o token para reutilização
        fs.writeFileSync("token.json", JSON.stringify(token));
        callback(oAuth2Client);
      });
    });
  }

  // Carregar o token de acesso salvo ou obter um novo
  function authorize(callback) {
    try {
      const token = fs.readFileSync("token.json", "utf8");
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    } catch (err) {
      getAccessToken(oAuth2Client, callback);
    }
  }

  // Função para chamar a API do Google Search Console
  function listSearchConsoleSites(auth) {
    const webmasters = google.webmasters({ version: "v3", auth });
    webmasters.sites.list({}, (err, res) => {
      if (err) return console.error("The API returned an error: " + err);
      const sites = res.data.siteEntry;
      if (sites.length) {
        console.log("Sites:");
        sites.forEach((site) => {
          console.log(`${site.siteUrl} (${site.permissionLevel})`);

          if (site.siteUrl === "https://www.goethe.de/prj/hum/") {
            async function getData() {
              let query = {
                auth: auth,
                siteUrl: site.siteUrl,
                startDate: "2024-04-21",
                endDate: "2024-04-22",
                dimensions: ["query", "date", "country", "page"],
                dimensionFilterGroups: [
                  {
                    groupType: "and",
                    // filters: [
                    //   {
                    //     dimension: "country",
                    //     operator: "contains", // Use o operador "contains" para filtrar páginas específicas
                    //   },
                    //   {
                    //     dimension: "page",
                    //     operator: "contains", // Use o operador "contains" para filtrar páginas específicas
                    //   },
                    // ],
                  },
                ],
                type: "web",
                aggregationType: "auto",
                rowLimit: 25000,
                startRow: 0,
              };

              webmasters.searchanalytics.query(query).then((data) => {
                let formattedResponse = data?.data?.rows?.map((item) => {
                  return {
                    query: item.keys[0],
                    date: item.keys[1],
                    country: item.keys[2],
                    page: item.keys[3],
                    clicks: item.clicks,
                    impressions: item.impressions,
                    ctr: item.ctr,
                    position: item.position,
                  };
                });

                console.log(formattedResponse);
              });
            }

            getData();
          }
        });
      } else {
        console.log("No sites found.");
      }
    });
  }

  // Autorizar e chamar a função da API
  authorize(listSearchConsoleSites);
};

module.exports = googleAPI;
