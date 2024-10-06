


const mongoose = require('mongoose');

let user_Type_schema = new mongoose.Schema({
    user_type: {
        type: String
    }
});

module.exports = mongoose.model('user_Type', user_Type_schema);

