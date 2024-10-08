//packs
const { GoogleSpreadsheet } = require("google-spreadsheet");
const axios = require("axios");
const fetch = require("node-fetch");

// Initialize Google Sheets Auth
const creds = require("./tokens/key.json");
const doc = new GoogleSpreadsheet(
  "1JlicWF4OP7qgyRXDR7UFp3zpjigT3Lx9DrqjF-8IlsU"
);

async function deleteRows() {
  await doc.useServiceAccountAuth(creds);

  // Carrega as propriedades do documento e as planilhas
  await doc.loadInfo();

  // Instancia a planilha age_gender
  const adsGenderAgePageSheet = doc.sheetsByIndex[4];

  // Obtém os dados da planilha
  const items = await adsGenderAgePageSheet.getRows();

  // Usar for...of para deletar linhas de forma assíncrona
  for (const item of items) {
    if (item.date_start.toString().includes("15.01.2024")) {
      try {
        await item.delete(); // Apaga a linha
        console.log(`Linha deletada: ${item.date_start}`);
      } catch (error) {
        console.error(`Erro ao deletar linha: ${error}`);
      }
    }
  }
}

deleteRows();

// const account = "act_726387872139953";
// const token = "";

// const url = `https://graph.facebook.com/v19.0/${account}/insights?time_increment=1&time_range={since:'2024-09-15',until:'2024-09-30'}&level=ad&fields=ad_id,campaign_name, adset_name, ad_name,frequency,spend,reach,impressions,objective,optimization_goal,clicks,actions&action_breakdowns=action_type&breakdowns=age,gender&access_token=${token}`;

// async function fetchPaginatedData(url) {
//   let allData = [];
//   let nextUrl = url;
//   do {
//     try {
//       const response = await fetch(nextUrl, { timeout: 30000 }); // timeout em milissegundos (30 segundos)
//       const data = await response.json();
//       if (data.data) {
//         allData = allData.concat(data.data);
//       } else {
//         console.log({ error: data.error });
//       }
//       nextUrl = data.paging ? data.paging.next : null;
//     } catch (error) {
//       console.error(`Fetch error: ${error.message}`);
//       break;
//     }
//   } while (nextUrl);

//   return allData;
// }

// const data = await fetchPaginatedData(url);
// console.log(data[0]);
