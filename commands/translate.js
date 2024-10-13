const logger = require('../utils/logger');
const messenger = require('../utils/messenger');

module.exports = {
    data: {
        name: 'translate',
        description: 'DeepL APIでの翻訳文が返ってきます．',
        type: 1,
        options: [
            {
                name: '原文',
                description: '翻訳したい文を入れてください．',
                type: 3,
                required: true
            },
            {
                name: '翻訳先',
                description: '翻訳先の言語を指定してください．',
                type: 3,
                required: true,
                choices: [
                    {
                        name: '日本語',
                        value: 'JA'
                    },
                    {
                        name: '英語（米国）',
                        value: 'EN-US'
                    },
                    {
                        name: '英語（英国）',
                        value: 'EN-GB'
                    },
                    {
                        name: '中国語（簡体字）',
                        value: 'ZH'
                    },
                    {
                        name: '韓国語',
                        value: 'KO'
                    },
                    {
                        name: 'インドネシア語',
                        value: 'ID'
                    },
                    {
                        name: 'ドイツ語',
                        value: 'DE'
                    },
                    {
                        name: 'フランス語',
                        value: 'FR'
                    },
                    {
                        name: 'イタリア語',
                        value: 'IT'
                    },
                    {
                        name: 'スペイン語',
                        value: 'ES'
                    },
                    {
                        name: 'ポルトガル語',
                        value: 'PT-PT'
                    },
                    {
                        name: 'ロシア語',
                        value: 'RU'
                    },
                    {
                        name: 'オランダ語',
                        value: 'NL'
                    },
                    {
                        name: 'ポーランド語',
                        value: 'PL'
                    },
                    {
                        name: 'トルコ語',
                        value: 'TR'
                    }
                ]
            },
            {
                name: '添付ファイル',
                description: 'ファイルを添付してください（テキストファイルのみ）．',
                type: 11,
                required: false
            },
            {
                name: '公開',
                description: '他のユーザに公開するかを選択してください．',
                type: 5,
                required: false
            }
        ]
    },

    async execute(interaction, DEEPL) {
        const channelId = process.env.CHAT_CHANNEL_ID.split(',');
        const deepLEmoji = process.env.DEEPL_EMOJI;
        // チャンネルが `DeepL` 用の場合に実行
        if (channelId.includes(interaction.channelId)) {
            // `translate` コマンドが呼び出された場合 DeepL に依頼文を送信
            try {
                // 原文を取得
                const original = interaction.options.getString('原文');
                // 翻訳先言語を取得
                const target = interaction.options.getString('翻訳先');
                await logger.logToFile(`依頼文 : ${original.trim()}`); // 依頼文をコンソールに出力

                // 添付ファイルがある場合は内容を取得
                let attachmentContent = '';
                if (interaction.options.get('添付ファイル')) {
                    const attachment = interaction.options.getAttachment('添付ファイル');
                    // 添付ファイルがテキストの場合は質問文に追加
                    if (attachment.contentType.startsWith('text/')) {
                        try {
                            const response = await fetch(attachment.url);
                            const arrayBuffer = await response.arrayBuffer();
                            attachmentContent = Buffer.from(arrayBuffer).toString();
                        } catch (error) {
                            await logger.errorToFile('添付ファイルの取得中にエラーが発生', error);
                        }
                    }
                    await logger.logToFileForAttachment(attachmentContent.trim());
                }

                // 公開設定を取得
                const isPublic = interaction.options.getBoolean('公開') ?? true;

                // interaction の返信を遅延させる
                await interaction.deferReply({ ephemeral: !isPublic });

                // DeepL に依頼文を送信し翻訳文を取得
                (async () => {
                    let usage = [];
                    try {
                        let request = '';
                        // 添付ファイルがある場合は内容を翻訳文に追加
                        if (attachmentContent) {
                            request = `${original}\n${attachmentContent}`;
                        } else {
                            request = original;
                        }

                        const answer = await DEEPL.translateText(request, null, target);
                        await logger.logToFile(`翻訳文 : ${answer.text.trim()}`); // 翻訳文をコンソールに出力
                        // 使用トークン情報を取得
                        usage = answer.billedCharacters;

                        await interaction.editReply(messenger.answerMessages(deepLEmoji, answer, target));
                    } catch (error) {
                        // Discord の文字数制限の場合
                        if (error.message.includes('Invalid Form Body')) {
                            await logger.errorToFile('Discord 文字数制限が発生', error);
                            await interaction.editReply(messenger.errorMessages('Discord 文字数制限が発生しました', error.message));
                        }
                        // その他のエラーの場合
                        else {
                            await logger.errorToFile('DeepL API の返信でエラーが発生', error);
                            await interaction.editReply(messenger.errorMessages('DeepL API の返信でエラーが発生しました', error.message));
                        }
                    } finally {
                        // 使用トークンをロギング
                        await logger.tokenToFile(usage);
                    }
                })();
            } catch (error) {
                await logger.errorToFile('原文の取得でエラーが発生', error);
                await interaction.editReply(messenger.errorMessages('原文の取得でエラーが発生しました', error.message));
            }
        }
        // インタラクションが特定のチャンネルでなければ何もしない
        else {
            await interaction.reply({
                content: messenger.usageMessages(`このチャンネルでは \`${this.data.name}\` コマンドは使えません`),
                ephemeral: true
            });
            return;
        }
    }
};
