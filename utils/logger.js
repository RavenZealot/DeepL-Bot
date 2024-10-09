const FS = require('fs');
const PATH = require('path');

module.exports = {
    // ログをファイルに書き込む
    logToFile: function (message) {
        const now = new Date();
        const timestamp = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const logFilePath = PATH.resolve(__dirname, `../deepl-bot.log`);

        const logMessage = `${timestamp} - ${message}`;
        FS.appendFileSync(logFilePath, logMessage + '\n');
        console.log(logMessage);
    },

    // 添付ログをファイルに書き込む
    logToFileForAttachment: function (attachment) {
        const now = new Date();
        const timestamp = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const logFilePath = PATH.resolve(__dirname, `../deepl-bot.log`);
        const logMessage = `${timestamp} - 添付 : \r\n--------------------\r\n${attachment}\r\n--------------------\r\n`;
        FS.appendFileSync(logFilePath, logMessage + '\n');
    },

    // エラーログをファイルに書き込む
    errorToFile: function (message, error) {
        const now = new Date();
        const timestamp = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const logFilePath = PATH.resolve(__dirname, `../deepl-bot.log`);

        // ログにはフルスタックを，コンソールにはエラーメッセージのみを出力
        const logMessage = `${timestamp} - ${message} : ${error.stack}`;
        const errorMessage = `${timestamp} - ${message} : ${error.message}`;
        FS.appendFileSync(logFilePath, logMessage + '\n');
        console.error(errorMessage);
    },

    // コマンドを起動したユーザ情報をファイルにのみ書き込む
    commandToFile: function (interaction) {
        const logFilePath = PATH.resolve(__dirname, `../deepl-bot.log`);

        const userInfo = [
            `\n`,
            `---------- ユーザ情報 ----------`,
            `コマンド : ${interaction.commandName}`,
            `ユーザ名 : ${interaction.user.username}`,
            `ユーザID : ${interaction.user.id}`,
            `--------------------------------`
        ].join('\n');

        FS.appendFileSync(logFilePath, userInfo + '\n');
    },

    // コマンド実行で使用したトークンをファイルに書き込む
    tokenToFile: function (usage) {
        const logFilePath = PATH.resolve(__dirname, `../deepl-bot.log`);

        const tokenInfo = [
            ``,
            `--------- トークン情報 ---------`,
            `総計トークン : ${usage}`,
            `--------------------------------`
        ].join('\n');

        FS.appendFileSync(logFilePath, tokenInfo + '\n');
    },

    // ログファイルのバックアップと新規作成
    logRotate: function () {
        const logFilePath = PATH.resolve(__dirname, `../deepl-bot.log`);
        const backupLogFilePath = PATH.resolve(__dirname, `../deepl-bot-backup.log`);

        // バックアップファイルが存在する場合は削除
        if (FS.existsSync(backupLogFilePath)) {
            FS.unlinkSync(backupLogFilePath);
        }

        // ログファイルをバックアップ
        if (FS.existsSync(logFilePath)) {
            FS.renameSync(logFilePath, backupLogFilePath);
        }

        // 新しいログファイルを作成
        FS.writeFileSync(logFilePath, '');
    }
};
