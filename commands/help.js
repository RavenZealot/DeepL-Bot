const logger = require('../utils/logger');
const messenger = require('../utils/messenger');

module.exports = {
    data: {
        name: 'help',
        description: 'コマンドの使用方法を説明します．',
        type: 1,
        options: [
            {
                name: '対象コマンド',
                description: '使用方法を確認するコマンドを選択してください．',
                type: 3,
                required: true,
                choices: [
                    {
                        name: 'translate',
                        value: 'translate'
                    }
                ]
            }
        ]
    },

    async execute(interaction) {
        const channelId = process.env.CHAT_CHANNEL_ID.split(',');
        // チャンネルが `DeepL` 用の場合に実行
        if (channelId.includes(interaction.channelId)) {
            try {
                // 対象コマンドを取得
                const target = interaction.options.getString('対象コマンド');

                // interaction の返信を遅延させる
                await interaction.deferReply({ ephemeral: true });

                // 対象コマンドを解説
                (async () => {
                    try {
                        const answer = helpGenerator(target);
                        await interaction.editReply(messenger.helpMessages(answer));
                    } catch (error) {
                        await logger.errorToFile('対象コマンドの解説でエラーが発生', error);
                        await interaction.editReply(messenger.errorMessages('対象コマンドの解説でエラーが発生しました', error.message));
                    }
                })();
            } catch (error) {
                await logger.errorToFile('対象コマンドの取得でエラーが発生', error);
                await interaction.editReply(messenger.errorMessages('対象コマンドの取得でエラーが発生しました', error.message));
            }
        }
        // インタラクションが特定のチャンネルでなければ何もしない
        else {
            await interaction.reply({
                content: `${messenger.usageMessages(`このチャンネルでは \`${this.data.name}\` コマンドは使えません`)}`,
                ephemeral: true
            });
            return;
        }
    }
};

function helpGenerator(target) {
    switch (target) {
        case 'translate':
            return `\`${target}\` コマンドは，\`DeepL API\` を用いて，\`原文\` を \`翻訳先\` に翻訳します．
\`翻訳先\` は以下の通りです．

・\*\*日本語\*\*
\> \`JA\`
・\*\*英語（米国）\*\*
\> \`EN-US\`
・\*\*英語（英国）\*\*
\> \`EN-GB\`
・\*\*中国語（簡体字）\*\*
\> \`ZH\`
・\*\*韓国語\*\*
\> \`KO\`
・\*\*インドネシア語\*\*
\> \`ID\`
・\*\*ドイツ語\*\*
\> \`DE\`
・\*\*フランス語\*\*
\> \`FR\`
・\*\*イタリア語\*\*
\> \`IT\`
・\*\*スペイン語\*\*
\> \`ES\`
・\*\*ポルトガル語\*\*
\> \`PT-PT\`
・\*\* ロシア語\*\*
\> \`RU\`
・\*\*オランダ語\*\*
\> \`NL\`
・\*\*ポーランド語\*\*
\> \`PL\`
・\*\*トルコ語\*\*
\> \`TR\`

Discord の文字数制限により \`原文\` の全文が入力できない場合，\`添付ファイル\` の利用を検討してください．
ただし，\`添付ファイル\` はテキストファイル（MINE : \`text/*\`）のみ対応しています．`;
        default:
            return `対象のコマンドを選択してください．`;
    }
};
