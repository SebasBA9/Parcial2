// controllers/game.controller.js
const GameModel = require('../models/game.model');
const UserModel = require('../models/user.model');
const LeaderboardModel = require('../models/scoreboard.model');

//Words
const words = require('../words/words').words

function selectRandomWord(startingLetter) {
    let filteredWords;

    // Si no se proporciona startingLetter, usa todas las palabras
    if (!startingLetter) {
        filteredWords = words;
    } else {
        // Verificar si startingLetter es una letra válida
        if (!/^[a-zA-Z]$/.test(startingLetter)) {
            throw new Error("Invalid starting letter.");
        }

        // Filtrar palabras que comiencen con la letra proporcionada
        filteredWords = words.filter(word => word.toLowerCase().startsWith(startingLetter.toLowerCase()));

        // Si no hay palabras que comiencen con la letra inicial, lanzar un error
        if (filteredWords.length === 0) {
            throw new Error("No words start with the provided starting letter.");
        }
    }

    return filteredWords[Math.floor(Math.random() * filteredWords.length)] || null
}

function isWordValid(proposedWord, lastCharacter) {
    return proposedWord[0].toLowerCase() === lastCharacter.toLowerCase();
}

/**
 * Calculate player's score based on the number of words used.
 * @param {string[]} usedWords - Array of words used in the game.
 * @returns {number} The calculated score as the length of the array.
 */

function calculateUserScore(usedWords) {
    console.log(usedWords.length)
    return usedWords.length;
}

async function fetchLastCharacter(req, res) {
    try {
        const { gameId } = req.params; 
        const game = await GameModel.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        res.status(200).send({ lastCharacter: game.lastCharacter });
    } catch (error) {
        res.status(500).send({ message: "Error retrieving the last character", error: error.toString() });
    }
}

async function initiateGame(req, res) {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Check for an existing active game
        const existingGame = await GameModel.findOne({ userId: userId, isGameOver: false });
        if (existingGame) {
            return res.status(400).send({ message: "Active game already exists for this user" });
        }

        const currentWord = selectRandomWord(); 
        const lastCharacter = currentWord.slice(-1);

        const newGame = new GameModel({
            userId: user._id,
            userName: user.userName,
            currentWord: currentWord,
            lastCharacter: lastCharacter,
            score: 0,
            isGameOver: false,
            startTime: new Date()
        });

        await newGame.save();
        res.status(201).send(newGame);
    } catch (error) {
        res.status(500).send({ message: "Error creating game", error: error.toString() });
    }
}

async function continueGame(req, res) {
    try {
        const { userId, word } = req.body;
        console.log(userId)
        console.log(word)

        if (isNaN(!word)){
            return res.status(400).send({ message: "No active game found for this user" });
        }
        const game = await GameModel.findOne({ userId: userId, isGameOver: false });
        if (!game) {
            return res.status(404).send({ message: "No active game found for this user" });
        }

        const timeLimit = 20000; 

        if (new Date() - game.startTime > timeLimit) {
            console.log("time expired")
            game.isGameOver = true;
            await game.save();
            const userInfo = await getUserInfo(game.userId);
            return res.status(200).send({
                message: "Time's up! Game over.",
                userName: userInfo.userName,
                correctWordsCount: game.score,
                position: userInfo.position
            });
        }

        if (!isWordValid(word, game.lastCharacter)) {
            game.isGameOver = true;
            await game.save();
            const userInfo = await getUserInfo(game.userId);
            return res.status(400).send({ 
                message: "Invalid word! Game over.",
                userName: userInfo.userName,
                correctWordsCount: game.score,
                position: userInfo.position
            });
        }

        game.usedWords.push(word);
        const newWord = selectRandomWord(word.slice(-1));
        game.currentWord = newWord;
        game.lastCharacter = newWord.slice(-1);
        game.score = game.usedWords.length;
        game.startTime = new Date();
        await game.save();

        await updateLeaderboard(game.userId, 1);  

        res.status(200).send({
            message: "Correct! Continue playing.",
            game
        });
    } catch (error) {
        res.status(500).send({ message: "Error continuing game, incorrect word", error: error.toString() });
    }
}


async function getUserInfo(userId) {
    const leaderboard = await LeaderboardModel.findOne();
    const userEntry = leaderboard.users.find(u => u.userId.equals(userId));
    return {
        userName: userEntry.userName,
        position: leaderboard.users.findIndex(u => u.userId.equals(userId)) + 1
    };
}
async function updateLeaderboard(userId, additionalPoints) {
    try {
        let leaderboard = await LeaderboardModel.findOne({"users.userId": userId});

        if (leaderboard) {
            await LeaderboardModel.updateOne(
                { "users.userId": userId },
                { "$inc": { "users.$.score": additionalPoints } }
            );
        } else {
            leaderboard = await LeaderboardModel.findOne();
            if (leaderboard) {
                await LeaderboardModel.updateOne(
                    { "_id": leaderboard._id },
                    { "$push": { "users": { userId: userId, score: additionalPoints } } }
                );
            } else {
                leaderboard = new LeaderboardModel({
                    users: [{ userId: userId, score: additionalPoints }]
                });
                await leaderboard.save();
            }
        }

        leaderboard = await LeaderboardModel.findOne();
        if (leaderboard) {
            leaderboard.users.sort((a, b) => b.score - a.score); 
            await leaderboard.save(); 
        }
    } catch (error) {
        console.error("Error updating the leaderboard:", error);
        throw error; 
    }
}


module.exports = {
    initiateGame,
    continueGame,
    fetchLastCharacter,
    calculateUserScore,
    isWordValid,
    selectRandomWord,
    calculateUserScore
};