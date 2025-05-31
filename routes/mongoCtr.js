const {MongoClient} = require('mongodb');
const path = require('path');
const config_path = path.join(__dirname, "../middleware/config.js");
const config = require(config_path);
const bcrypt = require('bcrypt');

class db {
    constructor() {
        this.client = new MongoClient(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        this.db = null;
        this.collection = null;
    }

    async connect() {
        try {
            await this.client.connect();
            console.log("Connected to MongoDB");
            this.db = this.client.db('messages');
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);
            return (error)
        }
    }

    async setCol(collection){
        this.collection = await this.db.collection(collection);
    }
    

    async checkUser(username) {
        const collection = this.db.collection('users');
        const user = await collection.findOne({ username });
        return user;
    }

    async checkLogin(username, password) {
        this.setCol('users')

        const user = await this.checkUser(username);

        if (!user) {
            return false;
        }
        
        const validPassword = await bcrypt.compare(password, user.password);
        
        return validPassword ? true : false;
    }

    async registerUser(username, password){
        try{
            const collection = this.db.collection('users');
            const hashedPassword = await bcrypt.hash(password, 10);
            if(await this.checkUser(username)) {
                return false; // User already exists
            }else {
                const result = await collection.insertOne({ username, password: hashedPassword });
                return result.acknowledged ? true : false;
            }
        }
        catch(error){
            console.error("Error registering user:", error);
            return false;
        }
    }

    async deleteUser(username, password) {
        try{
            const sel_user = await this.checkUser(username, password)
            if(!sel_user) {
                return false; // User not found or password incorrect
            }
            const collection = this.db.collection('users');

            const result = this.db.collection('users').deleteOne({ username: username });
            return result.acknowledged ? true : false;
        }
        catch(error){
            console.error("Error deleting user:", error);
            return false;
        }
    }


        
}

module.exports = new db();
