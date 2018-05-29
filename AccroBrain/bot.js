var parser = require("./parser");
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

var wasSet = false;

var array = [];
array.push('+');
array.push('-');
array.push('>');
array.push('<');
array.push('.');
array.push('[');
array.push(']');

logger.remove(logger.transports.Console);

logger.add(logger.transports.Console,
    {
        colorize: true
    });

logger.level = 'debug';

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ' )');
});

function sendMessage(bot, channelID, string) {
    bot.sendMessage({
        to: channelID,
        message: string
    });
}
function remove(array, element) {
    return array.filter(e => e != element);
}
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == "!") {
        var args = message.substring(1).split(' ');
        var cmd = args[0];


        args = args.splice(1);
        logger.info("message : " + args);

        try {

            switch (cmd) {
                case 'parse':
                    if (!wasSet) {
                        args = args.join('').split('');
                    }
                    sendMessage(bot, channelID, parser.parse(args, array));
                    break;

                case 'set':
                    for (var i = 0; i <= 6; i++) {
                        array[i] = args[i];
                    }

                    wasSet = true;

                    logger.info("array = " + array);
                    logger.info("args = " + args);
                    logger.info("wasSet = " + wasSet);

                    break;
                default:
                    bot.sendMessage({
                        to: channelID,
                        message: "Unknown command"
                    });
                    break;
            };
        }
        catch (err) {
            sendMessage(bot, channelID, err);

        }
    }

});