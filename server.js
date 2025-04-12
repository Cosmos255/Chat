const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const db = require('./routes/mongoCtr.js')

const config = require('./middleware/config.js')

const tk = require('./middleware/token.js')

const port = 3000



db.connect()


app.use(express.json())
app.use(cors());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.redirect('/messages')
})

app.get('/messages', (req, res) => {
    try{
        const token = req.cookies.token

        if(!token){ 
            return res.redirect('log_in')
        }

        const payload = jwt.verify(token, 'key')
        res.send(indexHTML)

    }catch (err){
        console.log(err)
        return res.redirect('log_in')
    }
})

app.get('/log_in', (req, res) => {
    res.send(log_in)
})

app.get('/register', (req, res) => {
    res.send(register)
})

app.get('/style.css', (req, res) => {
    res.send(indexCSS)
})
app.get('/script.js', (req, res) => {
    res.send(indexJS)
})

app.post('/log_in', async (req, res) => {
    const {username, password} = req.body
    if(!username || !password){
        return res.status(400).json({message: "Username and password are required"})
    }

    const collection = db.collection('users')
    const user = await checkUser(username)
    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    const validPassword = await checkPassword(password, user)
    if(!validPassword){
        return res.status(400).json({message: "Invalid password"})
    }

    if(validPassword){
       // const cookie = req.cookies.token
       // const decodedToken = jwt.verify(cookie, )

        //if(req.cookies.token &! blacklistedTokens.has(req.cookies.token)){
           // const cookie = req.cookies.token
          //  return res.status(200).json({message: "User already logged in", redirect:'/messages'})
        //}
       // elseif(blacklistedTokens.has(req.cookies.token) | !req.cookies.token){
            const token = jwt.sign({username}, 'key', {
                expiresIn: '1h'
            })

            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 3600000 // 1 hour
            })

            return res.status(200).json({message: "User logged in successfully", redirect:'/messages'})
      //  }  
    }
})

app.post('/register', async (req, res) => {
    try{
        await connect()
        const {username, password} = req.body

        if(!username || !password){
            return res.status(400).json({message: "Username and password are required"})
        }

        encrypetdPassword = await bcrypt.hash(password, 10)

        const collection = db.collection('users')

        const existingUser = await collection.findOne({username: username})
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }

        await collection.insertOne({username: username, password: encrypetdPassword})

        res.status(201).redirect('localhost:3000/log_in')    

    }catch(e){
        console.log(e)
        res.status(500).json({message: "Internal server error"})
    }
})

app.post('/logout', (req, res) => {
    const token = req.cookies.token
    if(token){
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        blacklistedTokens.add(decodedToken.jti)
        res.clearCookie('token')
        res.json({message: "User logged out successfully", redirect: '/log_in'})
    
    }else{
        res.status(401).json({message: "User not logged in"})
    }
})


const {Server} = require("socket.io");
const { redirect } = require('next/dist/server/api-utils');
const io = new Server(app.listen(port, () => {
    console.log("Running")
}))

io.on('connection', (socket) => { 
    console.log('a user connected'+socket.id);
    let userNickname = "User";
    socket.on('set_nickname', (nickname) => {
        userNickname = nickname;
        console.log(client.db('messages').collection("author").find())
    })

    socket.on('new_message',(message)=>{
        console.log(message)
        io.emit('message',message)
    })
})



async function checkUser(username){
    const collection = db.collection('users')
    const user = await collection.findOne({username: username})
    if(!user){
        return false
    }
    return user
}

async function checkPassword(password, user){
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword){
        return false
    }
    return true
}
