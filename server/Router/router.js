const express = require('express');
const router = express.Router();
const controller = require('../user-controller/controller');
const accessControl = require('../util/access-control').accessControl



function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}
router.post('/signin',setAccessControl("1"),controller.signin)
router.get(`/getAllData`,setAccessControl("1"),controller.getAllData)
router.get(`/user/:id`,setAccessControl('*'),controller.getsingle)
router.put('/user/:id',setAccessControl('1'),controller.updateUser)
router.delete('/user/:id',setAccessControl('1'),controller.deleteUser);

module.exports = router

