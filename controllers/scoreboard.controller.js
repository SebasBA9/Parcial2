const ScoreboardModel = require('../models/scoreboard.model');
const UserModel = require('../models/user.model');  

async function createScoreboard(req, res) {
    try {
        const existingScoreboard = await ScoreboardModel.findOne();
        if (existingScoreboard) {
            return res.status(400).send({ message: "A scoreboard already exists." });
        }

        const newScoreboard = new ScoreboardModel({
            users: []
        });

        await newScoreboard.save();
        res.status(201).send(newScoreboard);
    } catch (error) {
        res.status(500).send({ message: "Error creating scoreboard", error: error.toString() });
    }
}

// Agregar o actualizar un usuario en el scoreboard
async function addUserToScoreboard(req, res) {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const scoreboard = await ScoreboardModel.findOne();
        if (!scoreboard) {
            return res.status(404).send({ message: "Scoreboard not found" });
        }

        let userEntry = scoreboard.users.find(u => u.userId.equals(userId));
        if (userEntry) {
            userEntry.userName = user.userName;
            userEntry.score = req.body.score || userEntry.score; 
        } else {
            scoreboard.users.push({ userId: user._id, userName: user.userName, score: req.body.score || 0 });
        }

        scoreboard.users.sort((a, b) => b.score - a.score);

        await scoreboard.save();
        res.status(200).send(scoreboard);
    } catch (error) {
        res.status(500).send({ message: "Error adding user to scoreboard", error: error.toString() });
    }
}

async function getTopPlayers(req, res) {
    try {
        const scoreboard = await ScoreboardModel.findOne().populate({
            path: 'users.userId',
            select: 'userName score'  
        });

        if (!scoreboard) {
            return res.status(404).send({ message: "Scoreboard not found" });
        }

        res.status(200).send(scoreboard.users.slice(0, 10));
    } catch (error) {
        res.status(500).send({ message: "Error retrieving top players", error: error.toString() });
    }
}

module.exports = {
    createScoreboard,
    addUserToScoreboard,
    getTopPlayers
};


