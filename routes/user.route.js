const express = require('express');
const userController = require('./../controllers/user.controller');

const route = express.Router();


route.post('/', userController.uploadUser, userController.createUser);//เพิ่มข้อมูล

route.get('/:userName/:userPassword', userController.checkLogin);//ค้นหา ตรวจสอบ ดึง ดู

route.put('/:userID',userController.uploadUser, userController.updateUser) //แก้ไข

module.exports = route;