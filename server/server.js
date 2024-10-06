const express = require('express')
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongoConnect = require('../server/db/connect');
mongoConnect();

const router = require('./Router/router')
const authRouter = require('../server/Router/auth-Router')

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static('../client'));
app.use(router)
app.use(authRouter)



app.listen(process.env.PORT,()=>{
    console.log(`server is running at http://localhost:${process.env.PORT}`)
})