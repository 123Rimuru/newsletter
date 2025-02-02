require('dotenv').config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const https = require("https");
const { stringify } = require("querystring");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

const listId = process.env.MAILCHIMP_LIST_ID;
const apiKey = process.env.MAILCHIMP_API_KEY;
const dcRegion = process.env.MAILCHIMP_DC_REGION;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/i.html");
});

app.post("/res", (req, res) => { 
    // res.send(req.body.mail);

    var data1 = {
        members: [
            {
                email_address: req.body.mail,
                status: 'subscribed',
                merge_fields: {}
            }
        ]
    };

    var jdata = JSON.stringify(data1);

    const url = `https://${dcRegion}.api.mailchimp.com/3.0/lists/${listId}`;

    var options = {
        method: 'POST',
        auth: `anystring:${apiKey}`

    }

    var req1 = https.request(url, options, (res1) => {
        res1.on('data', (data) => {
            // res.send(JSON.parse(data));

            if (res1.statusCode == 200)
            {
                res.sendFile(__dirname + '/s.html');
            }
            else 
            {
                res.sendFile(__dirname + '/f.html');
            }
        })

        // console.log(res1.statusCode);
    })

    req1.write(jdata);
    req1.end();
}); 

app.listen(process.env.PORT || 3000, () => {
    console.log("lol");
});


