const express = require('express');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const festRoute = require('./routes/fest.route');

const app = express();


const port = process.env.PORT

require('dotenv').config();

//ใช้ตัวกลาง middleware
app.use(cors());
app.use(express.json());
app.use('/user', userRoute);
app.use('/fest',festRoute);
app.use('/images/fests', express.static('images/fests'));
app.use('/images/users', express.static('images/users'));


// เอาไว้เทสว่ารัน requset/response ได้ไหม
app.get('/', (req, res) => {
    res.json({ 
        message: 'Hello World....' 
    });
})


//สั่ง start web server โดยเปิด port รองรับการ requset/response ตามที่กำหนดไว้
app.listen({port}, () => {
    console.log(`Server is running on port ${port}`);
    // console.log("Server is running on port + port");
    // console.log('Server is running on port + port');
})

