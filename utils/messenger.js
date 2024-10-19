module.exports = {
    // ヘルプメッセージを生成
    helpMessages: function (answer) {
        return `:information_source: : ${answer.trim()}`;
    },

    // 回答メッセージを生成
    answerMessages(emoji, answer, source, target) {
        return `${emoji} \`${source} → ${target}\` : ${answer.trim()}`;
    },

    // エラーメッセージを生成
    errorMessages: function (answer, error) {
        return `:warning: **エラー** : ${answer} :warning:\n\`\`\`${error}\`\`\``;
    },

    // 使用不可メッセージを生成
    usageMessages: function (answer) {
        return `:prohibited: **エラー** : ${answer} :prohibited:`;
    }
};