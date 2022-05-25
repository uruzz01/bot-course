const TelegramApi = require("node-telegram-bot-api");

const token = "5194694333:AAEBBUvH8LpAiaeJK3x5NeSwEIKVOnHTNOk";

const {gameOptions, againOptions} = require("./options");

const bot = new TelegramApi(token, {polling: true});



const chats = {

};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "угадай цифру от 0 до 9");
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    //await bot.sendMessage(chatId,  chats[chatId]);
    await bot.sendMessage(chatId, "отгадывай", gameOptions);
}

const start = () => {

    bot.setMyCommands([
        {command: "/start", description: "Кинуть салам"},
        {command: "/info", description: "Узнать, кто ты есть"},
        {command: "/game", description: "Угадай число"},
    ]);
    
    bot.on("message", async function(msg){
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === "/start") {
            await bot.sendMessage(chatId, "Салам");
            return bot.sendSticker(chatId, "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp") 
        }
    
        if(text === "/info") {
            return bot.sendMessage(chatId, "Твое имя " + msg.from.first_name); 
        }

        if(text === "/game"){
            return startGame(chatId);  
        }
        return bot.sendMessage(chatId, "Не понял");
    });

    bot.on("callback_query", async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === "/again"){
           return startGame(chatId);
        }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, "Ты отгадал цифру " + chats[chatId], againOptions);
        } else {
            return bot.sendMessage(chatId, "К сожалению цифра была " + chats[chatId], againOptions);
        }
    });
};

start();
