require("dotenv").config();

const Twitter = require("twitter");
const Sentiment = require("sentiment");
const PouchDB = require("pouchdb");
const { v4: uuidv4 } = require("uuid");

const db = new PouchDB(process.env.COUCH_DB_URL);
const sentiment = new Sentiment();

var client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

console.log("Starting to fetch tweets...");

const stream = client.stream("statuses/filter", {
  track: "#covid19"
});

stream.on("data", async tweet => {
  const {
    created_at,
    id,
    lang,
    text,
    retweet_count,
    favorite_count,
    user: { screen_name, location, profile_image_url_https }
  } = tweet;

  if (lang === "en" && !text.includes("RT @")) {
    let { score, comparative, calculation, words, positive, negative } = sentiment.analyze(text);
    db.put({
      _id: uuidv4(),
      tweet: {
        id: id,
        text: text,
        retweet_count: retweet_count,
        favorite_count: favorite_count,
        user: {
          screen_name: screen_name,
          location: location,
          profile_image_url_https: profile_image_url_https
        },
        created_at: created_at
      },
      sentiment: {
        score: score,
        comparative: comparative,
        calculation: calculation,
        words: words,
        positive: positive,
        negative: negative
      }
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(err) {
      console.log(err);
    });
  }
});
