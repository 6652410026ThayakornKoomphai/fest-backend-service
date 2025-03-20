const express = require("express");
const festController = require("./../controllers/fest.controller");
const route = express.Router();

route.post('/', festController.uploadFest, festController.createFest);
//ค้นหา ตรวจสอบ ดึง ดู
route.get('/:userID', festController.getAllFestByUser);

route.get('/only/:festID', festController.getOnlyFest);

route.put('/:festID',festController.uploadFest, festController.updateFest)

route.delete('/:festID', festController.deleteFest);

module.exports = route;