Just testing creating GPT client

Steps:

1. Type - Text - console
2. Type - Text - telegram bot

## Steps

### Console

Just possibility chatting with GPT in console.

#### Done

I can chating with gpt throw console

## Tech

Needs:
File `.env` with `OPEN_AI_API_KEY`.

### Docker

For creating docker image need commad

```
docker build -t telegram-gpt .
```

For running vie `docker run`

```
docker run -it --name my-gpt-bot -e ADMIN_TELEGRAM_ID=****** -e TELEGRAM_TOKEN=****** -e OPEN_AI_API_KEY=****** telegram-gpt
```

For running vie `docker compose`
Will use env from file `.env`

```
docker-compose up -d
```
