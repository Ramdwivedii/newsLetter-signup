const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const { dirname } = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
  const first = req.body.first;
  const last = req.body.last;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_field: {
          fname: first,
          lname: last,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us22.api.mailchimp.com/3.0/lists/2b42edfaf1";
  const options = {
    method: "post",
    auth: "ramdwivedi:206e8d8490b9c32d88fb70faa9457e82-us22",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure.html" , function(req,res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running in port 3000");
});

// API key : b9e1cc27f83f9686ed4f7f54bb7ac5c4-us22
// List ID : 2b42edfaf1
