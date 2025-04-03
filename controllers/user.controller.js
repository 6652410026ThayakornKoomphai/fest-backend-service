// จัดการ DB
const {PrismaClient} = require('@prisma/client');
// จัดการการ Upload
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Console } = require('console');
const e = require('express');

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
         fileSize: 100000000,
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
        const { userFullName, userName, userPassword } = req.body;
        const result = await prisma.userTB.create({
            data: {
                userFullName: userFullName,
                userName: userName,
                userPassword:   userPassword,
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

exports.checkLogin = async (req, res) => {
    try {
        const result = await prisma.userTB.findFirst({
            where: {
                userName: req.params.userName,
                userPassword: req.params.userPassword
            }
        });
        if(result){
            res.status(200).json({
                message: 'OK',
                info: result
            })
        }else{
            res.status(404).json({
                message: 'Not Found',
                info: result
            })
        }

    } catch (error) {
        res.status(500).json({
            message: `พบปัญหาในการทำงาน: ${error}`
        })
        Console.log(`Error: ${error}`);
    }
}

//แก้ไขข้อมูลในตาราง DB----------------
exports.updateUser = async (req, res) => {
    try{ 
        let result = {};
        //ด้วยความที่มีการเก็บรูป เลยต้องมีการตรวจสอบก่อนว่า ข้อมูลนั้นมีรูปหรือไม่ ถ้าไม่มีรูปก็ไม่มีอะไร
        //แต่ถ้ามีรูป แล้วมีการอัปเดทรูป รูปที่มีอยู่เดิมจะถูกลบทิ้ง
        //ตรวจสอบว่าการแก้ไขนี้มีการอัพโหลดรูปมาเพื่ีอการแก้ไขมั้ย
        if(req.file){
            //แก้ไขรูปด้วยแบบแก้ไขข้อมูล ต้องลบรูปเก่าออกก่อน
            const userResult = await prisma.userTB.findFirst({
                where: {
                    userID: parseInt(req.params.userID)
                }
            })
            //เอาข้อมูลของ User ที่ได้มา มาดูว่ามีรูปมั้ย ถ้ามีให้ลบรูปนั้นทิ้ง
            if(userResult.userImage){
                fs.unlinkSync(path.join(userResult.userImage)) //ลบรูปทิ้ง
            }
            //แก้ไขข้อมูลในฐานข้อมูล
             result = await prisma.userTB.update({
                where: {
                    userID: parseInt(req.params.userID),
                },
                data:{
                userFullName: req.body.userFullName,
                userName: req.body.userName,
                userPassword:   req.body.userPassword,
                userImage: req.file.path.replace('images\\users\\', ' ')
                },
            })

        }else{
            //แก้ไขข้อมูลแบบไม่มีการแก้ไขรูป
             result = await prisma.userTB.update({
                where: {
                    userID: parseInt(req.params.userID),
                },
                data:{
                userFullName: req.body.userFullName,
                userName: req.body.userName,
                userPassword:   req.body.userPassword,
                },
            })
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
