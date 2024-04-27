const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        match: /^[a-zA-Z0-9]+$/  
    },
    score: {
        type: Number,
        default: 0  
    }
});

const UserModel = mongoose.model('Usuario', usuarioSchema, 'usuarios');

module.exports = UserModel;


