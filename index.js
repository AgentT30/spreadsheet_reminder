const {google} = require("googleapis");
const nodemailer = require('nodemailer');

let count = 0;

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

    // Set the current date and the next 7 dates
    const date = new Date();    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const firstday = new Date(date.getDate()+"-"+months[date.getMonth()]+"-"+date.getFullYear());
    const lastday = new Date(firstday);
    lastday.setDate(lastday.getDate() + 7);
    
    // Table Template
    var html_for_email = `
    <table>
        <tr>
            <th>Maturity Date:</th>
            <th>Bank Name:</th>
            <th>Account Number:</th>
        </tr>
    `;
    const rows = [];
    metaData.data.values.forEach((value) => {
        if(value[1] === 'Maturity Date'){
            return;
        }

        if(new Date(value[1]) > firstday && new Date(value[1]) < lastday){
            // Populate the HTML table with rows
            rows.push(`
                <tr>
                    <td>${value[1]}</td>
                    <td>${value[3]}</td>
                    <td>${value[2]}</td>
                </tr>
            `);
            count+=1;
        }
    });

    rows.forEach((row) => {
        html_for_email = html_for_email + `${row}`;
    });
    
    html_for_email+= `
    </table>
    `;

    if(count != 0){
        send_email(html_for_email);
    }
    else{
        console.log("No deposits due next week!");
    }
}

const send_email = (html_for_email) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.getenv(USERNAME),
          pass: process.getenv(PASSWORD)
        }
    });
    
    var mailOptions = {
        from: 'popingpopcorn33@gmail.com',
        to: 'cthekkunja304@gmail.com',
        subject: 'Email Notification of Deposits Due next week!',
        text: "Deposits due this week:",
        html: html_for_email
    };
      
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

spreadsheet_reader();