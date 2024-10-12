const FS = require('fs').promises;
const PATH = require('path');

module.exports = {
    // ログをファイルに書き込む
    logToFile: async function (message) {
        const now = new Date();
        const timestamp = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const logFilePath = getLogFilePath(`deepl-bot.log`);

        const logMessage = `${timestamp} - ${message}`;

        await FS.appendFile(logFilePath, logMessage + '\n');
        console.log(logMessage);
    },

    // 添付ログをファイルに書き込む
    logToFileForAttachment: async function (attachment) {
        const logFilePath = getLogFilePath(`deepl-bot.log`);

        const logMessage = [
            `========= 添付ファイル =========`,
            `内容 : ${attachment}`,
            `================================`
        ].join('\n');

        await FS.appendFile(logFilePath, logMessage + '\n');
    },

    // エラーログをファイルに書き込む
    errorToFile: async function (message, error) {
        const now = new Date();
        const timestamp = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const logFilePath = getLogFilePath(`deepl-bot.log`);

        // ログにはフルスタックを，コンソールにはエラーメッセージのみを出力
        const logMessage = `${timestamp} - ${message} : ${error.stack}`;
        const errorMessage = `${timestamp} - ${message} : ${error.message}`;

        await FS.appendFile(logFilePath, logMessage + '\n');
        console.error(errorMessage);
    },

    // コマンドを起動したユーザ情報をファイルにのみ書き込む
    commandToFile: async function (interaction) {
        const logFilePath = getLogFilePath(`deepl-bot.log`);

        const userInfo = [
            `\n`,
            `---------- ユーザ情報 ----------`,
            `コマンド : ${interaction.commandName}`,
            `ユーザ名 : ${interaction.user.username}`,
            `ユーザID : ${interaction.user.id}`,
            `--------------------------------`
        ].join('\n');

        await FS.appendFile(logFilePath, userInfo + '\n');
    },

    // コマンド実行で使用したトークンをファイルに書き込む
    tokenToFile: async function (usage) {
        const logFilePath = getLogFilePath(`deepl-bot.log`);

        const tokenInfo = [
            ``,
            `--------- トークン情報 ---------`,
            `総計トークン : ${usage}`,
            `--------------------------------`
        ].join('\n');

        await FS.appendFile(logFilePath, tokenInfo + '\n');
    },

    // ログファイルのバックアップと新規作成
    logRotate: async function () {
        const logFilePath = getLogFilePath(`deepl-bot.log`);
        const backupLogFilePath = getLogFilePath(`deepl-bot-backup.log`);

        // バックアップファイルが存在する場合は削除
        try {
            await FS.unlink(backupLogFilePath);
        } catch (error) {
            // ファイルが存在しない場合は無視
            if (error.code !== 'ENOENT') throw error;
        }
        // ログファイルをバックアップ
        try {
            await FS.rename(logFilePath, backupLogFilePath);
        } catch (error) {
            // ファイルが存在しない場合は無視
            if (error.code !== 'ENOENT') throw error;
        }

        // 新しいログファイルを作成
        await FS.writeFile(logFilePath, '');
    }
};

function getLogFilePath(fileName) {
    return PATH.resolve(__dirname, `../${fileName}`);
};
