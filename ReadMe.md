# DeepL-Bot

AI translate bot for Discord using DeepL API

## Reference

- [Quickstart - DeepL Documentation](https://developers.deepl.com/docs/getting-started/quickstart)

## Required (Only once)

- `.env` (Root directory)
  - DEEPL_API_KEY : DeepL [API keys](https://www.deepl.com/ja/your-account/keys)
  - BOT_TOKEN : Discord Application [Token](https://discord.com/developers/applications)
  - CHAT_CHANNEL_ID : for [Translate Text](https://developers.deepl.com/api-reference/translate)
    Multiple designations possible
  - DEEPL_EMOJI : Emoji for DeepL API (e.g. `<:DeepL:1234567890123456789>`)
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
