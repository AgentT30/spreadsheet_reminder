const {google} = require("googleapis");

const spreadsheet_reader = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "secrets.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });
    
    const client = await auth.getClient();

    const googleSheets = google.sheets({
        version: "v4",
        auth: client
    });

    sheet_id = '1TE6ISJWjbxRYG1MwWEKZQHHtN4sbP1cIq-_g3V74t2Q';
    const metaData  = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId: sheet_id,
        range: "Sheet1"
    });

    
    metaData.data.values.forEach((value)=>{
        console.log(value);
    })
}


spreadsheet_reader();