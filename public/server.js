if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const synonyms = require('./SYNONYMS.json')

const apiKey = process.env.API_KEY2;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./index.html"));
});

// app.get("/api", async (req, res) => {
//   let last = 0;
//   let arr = [];
//   const inputSentance = req.query.sentance.toLowerCase();
//   for (let i = 0; i < inputSentance.length; i++) {
//     if (
//       inputSentance.charCodeAt(i) <= 64 ||
//       inputSentance.charCodeAt(i) >= 123
//     ) {
//       if (i == last) {
//         arr.push(inputSentance.charAt(i));
//         last = i + 1;
//         continue;
//       }
//       arr.push(inputSentance.substring(last, i));
//       arr.push(inputSentance.charAt(i));
//       if (i != inputSentance.length) {
//         last = i + 1;
//       }
//     }
//   }
//   if (last != inputSentance.length) {
//     arr.push(inputSentance.substring(last, inputSentance.length));
//   }

//   // console.log(arr)

//   // const arr = req.query.sentance.toLowerCase().split(" ");
//   let finalSentance = "";

//   for (let i = 0; i < arr.length; i++) {
//     let possibleWords = [arr[i]];
//     let data;
//     if (arr[i].charCodeAt(0) <= 64 || inputSentance.charCodeAt(0) >= 123) {
//       finalSentance = finalSentance.concat(arr[i]);
//       continue;
//     }
//     try {
//       const response = await fetch(
//         `https://words.bighugelabs.com/api/2/${apiKey}/${arr[i]}/json`
//       );
//       data = await response.json();
//     } catch (e) {
//       // console.log('Word was not found')
//       finalSentance = finalSentance.concat(arr[i] + " ");
//       continue;
//     }

//     if (data.noun && data.noun.syn) {
//       possibleWords = possibleWords.concat(data.noun.syn);
//     }
//     if (data.verb && data.verb.syn) {
//       possibleWords = possibleWords.concat(data.verb.syn);
//     }
//     if (data.adjective && data.adjective.syn) {
//       possibleWords = possibleWords.concat(data.adjective.syn);
//     }
//     finalSentance = finalSentance.concat(
//       possibleWords[getRandomInt(possibleWords.length)]
//     );
//   }
//   // console.log(finalSentance)
//   res.json(capitalizeFirstLetter(finalSentance));
// });

app.get("/api", async (req, res) => {
  let last = 0;
  let arr = [];
  const inputSentance = req.query.sentance.toUpperCase();
  for (let i = 0; i < inputSentance.length; i++) {
    if (
      inputSentance.charCodeAt(i) <= 64 ||
      inputSentance.charCodeAt(i) >= 123
    ) {
      if (i == last) {
        arr.push(inputSentance.charAt(i));
        last = i + 1;
        continue;
      }
      arr.push(inputSentance.substring(last, i));
      arr.push(inputSentance.charAt(i));
      if (i != inputSentance.length) {
        last = i + 1;
      }
    }
  }
  if (last != inputSentance.length) {
    arr.push(capitalizeFirstLetter(inputSentance.substring(last, inputSentance.length)));
  }

  let finalSentance = "";

  for (let i = 0; i < arr.length; i++) {
    let possibleWords = [arr[i]];
    if (arr[i].length === 1) {
      finalSentance = finalSentance.concat(arr[i]);
      continue;
    }
    if (synonyms[arr[i]]) {
      possibleWords = possibleWords.concat(synonyms[arr[i]])
    }
    finalSentance = finalSentance.concat(
      possibleWords[getRandomInt(possibleWords.length)]
    );
  }
  res.json(capitalizeFirstLetter(finalSentance));
});


app.listen(process.env.PORT || 4000);