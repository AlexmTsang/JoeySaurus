const express = require("express");

const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const apiKey = "fcebb9f6cf73c2b2758b513a9befb6c7";

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/api", async (req, res) => {
  // console.log(req.query);

  //   const arr = req.body.sentance;

  const arr = req.query.sentance.split(" ");
  // const arr = ['Hello', 'There']
  let finalSentance = "";

  for (let i = 0; i < arr.length; i++) {
    let possibleWords = [arr[i]];
    let data;
    try {
      const response = await fetch(
        `https://words.bighugelabs.com/api/2/${apiKey}/${arr[i]}/json`
      );
      data = await response.json();
    } catch (e) {
      // console.log('Word was not found')
      finalSentance = finalSentance.concat(arr[i] + " ");
      continue;
    }

    if (data.noun && data.noun.syn) {
      possibleWords = possibleWords.concat(data.noun.syn);
    }
    if (data.verb && data.verb.syn) {
      possibleWords = possibleWords.concat(data.verb.syn);
    }
    if (data.adjective && data.adjective.syn) {
      possibleWords = possibleWords.concat(data.adjective.syn);
    }
    finalSentance = finalSentance.concat(
      possibleWords[getRandomInt(possibleWords.length)] + " "
    );
  }
  // console.log(finalSentance);
  res.json(finalSentance);
});

app.listen(4000);
