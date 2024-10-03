# DeepL-Bot

AI translate bot for Discord using DeepL API

## Reference

- [Introduction | DeepL API Documentation](https://developers.deepl.com/docs)

## Required (Only once)

- `.env` (Root directory)
  - DEEPL_API_KEY : Deepl [API keys](https://www.deepl.com/ja/your-account/keys)
  - BOT_TOKEN : Discord Application [Token](https://discord.com/developers/applications)
  - CHAT_CHANNEL_ID : for [Chat completions](https://platform.openai.com/docs/guides/chat/introduction)
    Multiple designations possible
  - DEEPL_EMOJI : Emoji for Deepl API
- Discord Application Generated URL

## Run

```shell-session
$ node bot/index.js
```

## Requests for developer (Optional)

In VS Code

1. Use [`Commit Message Editor`](https://marketplace.visualstudio.com/items?itemName=adam-bender.commit-message-editor) extention
   - Import `comit_template.json`
   - Use `Commit Message Editor` for messages when creating commits.
