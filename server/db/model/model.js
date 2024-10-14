// const mongoose = require('mongoose');
// // const userType = require('./user-type');

// let login_schema = new mongoose.Schema({
//     name : {
//         type : String,
//         // require : true,
//     },
//     email : {
//         type : String,
//         // requried : true,
//     },
//     password : {
//         type : String,
//         // requried : true,
//     },
//     confirm_password : {
//         type : String,
//         // required : true,
//     },
//     phone : {
//         type : Number,
//         // required : true,
//     },
//     age : {
//         type : Number,
//         // required : true,
//     },
//     userType : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "user_Type"
//     }

// })

// let login = mongoose.model('user-data',login_schema);
// module.exports = login


const mongoose = require('mongoose');

let login_schema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    confirm_password: {
        type: String,
    },
    phone: {
        type: String,
    },
    age: {
        type : Number,
    },
    userType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_Type'  // Correctly references the 'user_Type' model
    },
    image : {
        type : String
    },
    isFirstLogin: { 
        type: Boolean, default: true 
    },
    password_token :{
        type : String
    }
});

let login = mongoose.model('user-data', login_schema);
module.exports = login;
