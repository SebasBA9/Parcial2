const UserModel = require('../models/user.model');

async function createUser(req, res) {
    try {
        const { userName, score } = req.body; 
        console.log(userName) 

        const newUser = new UserModel({
            userName,
            score  
        });

        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send({ message: "Nombre de usuario invalido", error: error.toString() });
    }
}

module.exports = {
    createUser
    
};

