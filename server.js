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
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true    
}));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.redirect('/messages')
})

app.get('/messages', async (req, res) => {
    try{
        const token = req.cookies.token
        console.log("Received token:", token);
        //if(!token){ 
        //    return res.sendFile(config.paths.log_in)
        //}

        //const decoded = await tk.verifyToken(token)
   //     console.log(await decoded)
    //    if(!decoded){
    //       return res.status(400).json({ message: "Password is incorrect", /*redirect: "/log_in" */ });
    //    }

    //    console.log("Decoded token:", decoded);

        res.sendFile(config.paths.indexHTML)

    }catch (err){
        console.log(err)
        return res.redirect('log_in')
    }
})

app.get('/log_in', (req, res) => {
    res.sendFile(config.paths.log_in)
})

app.get('/register', (req, res) => {
    res.sendFile(config.paths.register)
})

app.get('/style.css', (req, res) => {
    res.send(indexCSS)
})
app.get('/script.js', (req, res) => {
    res.send(indexJS)
})

app.post('/log_in', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for missing fields
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user exists
    const user = await db.checkUser(username);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const valid = await db.checkLogin(username, password); // make sure this returns a Promise if async
    if (!valid) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Check for existing token
    const cookie = req.cookies.token;
    let decodedToken = null;
    
    if (cookie) {
      try {
        decodedToken = tk.verifyToken(cookie); // assuming this verifies the JWT
      } catch (err) {
        console.warn("Invalid or expired token"); // silently ignore
      }
    }

    if (cookie && decodedToken && !config.blacklistedTokens.has(decodedToken)) {
      return res.status(200).json({ message: "User already logged in", redirect: '/messages' });
    }

    // Otherwise generate a new token
    const token = await tk.generateToken({username}); // returns JWT

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',          // only send over HTTPS
      sameSite: 'Strict',    // protect against CSRF
      maxAge: 3600000,        // 1 hour
      path: '/'
    });

    return res.status(200).json({ message: "User logged in successfully", redirect: '/messages' });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




app.post('/register', async (req, res) => {
    try{
        await db.connect()
        const {username, password} = req.body
        console.log(username, password)

        if(!username || !password){
            return res.status(400).json({message: "Username and password are required"})
        }

        const existingUser = await db.registerUser(username, password)
        if(existingUser){
            return res.status(400).json({message: "User already exists"})
        }
       // res.status(201).json({message:"Redirects lol"})

        //Tryna fix redirects cuz they are broken and i have no idea why

        res.status(301).json({message:'/log_in'})    

    }catch(e){
        console.log(e)
        res.status(500).json({message: "Internal server error"})
    }
})

app.post('/logout', (req, res) => {
    const token = req.cookies.token
    if(token){
        const decodedToken = tk.verifyToken(token) //returns the jti
        tk.blacklistToken(decodedToken) //Only the jti please
        res.clearCookie('token')
        res.json({message: "User logged out successfully", redirect: '/log_in'})
    
    }else{
        res.status(401).json({message: "User not logged in"})
    }
})


const {Server} = require("socket.io");
const { redirect } = require('next/dist/server/api-utils');
const { error } = require('console');
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

    socket.on('new_message',(username , message)=>{
        console.log(`${username}: ${message}`)
        io.emit('message',username, message)
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
