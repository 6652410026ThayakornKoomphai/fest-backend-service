// จัดการ DB
const {PrismaClient} = require('@prisma/client');
// จัดการการ Upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Console } = require('console');

// สร้างตัวแปรอ้างอิงสำหรับ Prisma Client
const prisma = new PrismaClient();


// การอัพโหลดไฟล์----------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/users");
    } ,
    filename: (req, file, cb) => {
        cb(null, 'user_'+ Math.floor(Math.random()* Date.now()) + path.extname(file.originalname));
    }
})
exports.uploadUser = multer({
     storage: storage,
     limits: {
         fileSize: 1000000
     },
     fileFilter: (req, file, cb) => {
         const fileTypes = /jpeg|jpg|png/;
         const mimeType = fileTypes.test(file.mimetype);
         const extname = fileTypes.test(path.extname(file.originalname));
         if(mimeType && extname) {
             return cb(null, true);
         }
         cb("Error: Images Only");
     }
}).single("userImage");
 
//-----------------------------------------

//เอาข้อมูลที่ส่งมาจาก Frontend เพิ่ม(Create/Insert) ลงตาราง DB----------------
exports.createUser = async (req, res) => {
    try {
        //------------- 
        const result = await prisma.userTB.create({
            data: {
                userFullName: req.body.userFullName,
                userName: req.body.userName,
                userPassword: req.body.userPassword,
                userImage: req.file ? request.file.path.replace('images\\users\\', ' ') : '',
            }
        });
        //-------------
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
}

//-----------------------------------------