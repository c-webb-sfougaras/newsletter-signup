const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/b2ef9ac7bb";
  const options = {
    method: "POST",
    auth: "christinawebb567:0be1ad552bb9e22297320bc435972d44-us14",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      var parsedData = JSON.parse(data);
      if (parsedData.errors.length === 0) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("listening on port 3000...");
});

// api key for mailchimp 0be1ad552bb9e22297320bc435972d44-us14

// audience id for mailchimp b2ef9ac7bb
