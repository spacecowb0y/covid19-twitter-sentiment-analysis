# Twitter Sentiment Analysis: #COVID19

Sentiment analysis applied to the hashtag #covid19 from Twitter.

## Configuration

Copy the `.env.example` to `.env` and add your Twitter API credentials and the URL of your CouchDB instance.

## Run

With `nohup` we can easy run this proccess in background.

```
nohup npm run start > status.log &
```

## Log

You can check what the script is doing by running:

```
tail -f status.log
```