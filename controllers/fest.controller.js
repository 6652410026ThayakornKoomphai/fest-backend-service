const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


//? สร้างตัวแปรอ้างอิงสำหรับ prisma เพื่อเอาไปใช้
const prisma = new PrismaClient();

//? อัปโหลดไฟล์-----------------------------
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "images/fests");
},
filename: (req, file, cb) => {
cb(null, 'fest_' + Math.floor(Math.random() * Date.now()) + path.extname(file.originalname));
}
})
exports.uploadFest = multer({
storage: storage,
limits: {
fileSize: 1000000 //? file 1 mb
},
fileFilter: (req, file, cb) => {
const fileTypes = /jpeg|jpg|png/;
const mimeType = fileTypes.test(file.mimetype);
const extname = fileTypes.test(path.extname(file.originalname));
if (mimeType && extname) {
  return cb(null, true);
}
cb("Error: Images Only");
}
}).single("festImage");//? ต้องตรงกับ column ในฐานข้อมูล
//?-------------------------------------------------

//? การเอาข้อมูลที่ส่งมาจาก Frontend เพิ่ม(Create/Insert) ลงตารางใน DB
exports.createFest = async (req, res) => {
try {
const { festName,festDetail,festState,festCost,userID,festImage,festNumDay } = req.body; 
const result = await prisma.festTB.create({
  data: {
    festName: festName,
    festDetail: festDetail,
    festState: festState,
    festCost: parseFloat(festCost),
    userID:parseInt(userID),
    festNumDay:parseInt(festNumDay),
    festImage:req.file ? req.file.path.replace("images\\fests\\", '') : "",
  }
})

res.status(201).json({
  message: "เพิ่มข้อมูลสําเร็จ",
  data: result
})
} catch (err) {
res.status(500).json({
  message: `พบเจอปัญหาในการทำงาน: ${err}`
})
console.log('Error', err);
}
}
//?-------------------------------------------------

exports.getAllFestByUser = async (req, res) => {
try{
const result = await prisma.festTB.findMany({
  where: {
      userID : parseInt(req.params.userID),

  },
})
res.status(200).json({
  message: 'OK',
  info: result,
})
}catch (err) {
res.status(500).json({
  message: `พบเจอปัญหาในการทำงาน: ${err}`
})
console.log('Error', err);
}
}
//?-------------------------------------------------

//ดึงข้อมูล Fest หนึ่งๆ เพื่อจะเอาไป .. เช่น แก้ไขเป็นต้น

exports.getOnlyFest = async (req, res) => {
try{
const result = await prisma.festTB.findFirst({
  where: {
    festID : parseInt(req.params.festID),

  },
})
res.status(200).json({
  message: 'OK',
  info: result,
})
}catch (err) {
res.status(500).json({
  message: `พบเจอปัญหาในการทำงาน: ${err}`
})
console.log('Error', err);
}
}

//?-------------------------------------------------

exports.updateFest = async (req, res) => {
try{ 
    let result = {};
    if(req.file){
        //แก้ไขรูปด้วยแบบแก้ไขข้อมูล ต้องลบรูปเก่าออกก่อน
        const festResult = await prisma.festTB.findFirst({
            where: {
                festID: parseInt(req.params.festID)
            }
        })
        //เอาข้อมูลของ User ที่ได้มา มาดูว่ามีรูปมั้ย ถ้ามีให้ลบรูปนั้นทิ้ง
        if(festResult.festImage){
            fs.unlinkSync(path.join(festResult.festImage)) //ลบรูปทิ้ง
        }
        //แก้ไขข้อมูลในฐานข้อมูล
          result = await prisma.festTB.update({
            where: {
              festID: parseInt(req.params.festID),
            },
            data:{
              data: {
                festName: req.body.festName,
                festDetail: req.body.festDetail,
                festState: req.body.festState,
                festCost: parseFloat(req.body.festCost),
                userID:parseInt(req.body.userID),
                festNumDay:parseInt(req.body.festNumDay),
                festImage:req.file ? req.file.path.replace("images\\fests\\", '') : "",
              }
            }
        })

    }else{
        //แก้ไขข้อมูลแบบไม่มีการแก้ไขรูป
        result = await prisma.festTB.update({
          where: {
            festID: parseInt(req.params.festID),
          },
            data: {
              festName: req.body.festName,
              festDetail: req.body.festDetail,
              festState: req.body.festState,
              festCost: parseFloat(req.body.festCost),
              userID:parseInt(req.body.userID),
              festNumDay:parseInt(req.body.festNumDay),
            }
          }
        )
    }
    res.status(201).json({
        message: 'OK',
        info: result
    })
} catch (error) {
    res.status(500).json({
        message: `พบปัญหาในการทำงาน: ${error}`
    })
    Console.log(`Error: ${error}`);
}
};


//ลบfest
exports.deleteFest = async (req, res) => {
  try {
      const result = await prisma.festTB.delete({
          where: {
              festID: parseInt(req.params.festID),
          },
      });
      res.status(200).json({
          message: 'OK',
          info: result,
      });
  } catch (error) {
      res.status(500).json({
          message: `พบปัญหาในการทำงาน: ${error}`
      })
      Console.log(`Error: ${error}`);
  }
}