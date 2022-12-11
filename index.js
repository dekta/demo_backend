const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const {connect} = require('./config/db');
const {UserModel}=require('./models/application.model');
const {authenticate} = require("./middlewares/authentication")
const {appRouter} = require("./routes/application.route")

const app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}))

require('dotenv').config()

app.get('/',(req,res)=>{
    res.send("welcome")
})

app.post("/signup", async(req,res)=>{
    const {name,email,password,phonenumber} = req.body;
    const userpresent = await UserModel.findOne({email})

    if(userpresent?.email){
        res.send("signup with new email")
    }
    else{
        try{
            bcrypt.hash(password, 5, async function(err, hash) {
                const user = new UserModel({name,email,password:hash,phonenumber})
                await user.save();
                res.send("signup successful")
            });
        }
        catch(err){
            res.send(err)
        }
    }

})

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user = await UserModel.find({email});
        if(user.length > 0){
            const hash_pass = user[0].password; 
            bcrypt.compare(password, hash_pass, function(err, result) {
                //console.log(result)
                if(result){
                    const token = jwt.sign({"userid":user[0]._id}, 'shhhhh');
                    
                    res.send({"msg":"Login successfull","token" : token})
                }
                else{
                    res.send("login failed")
                }
            });
        }
        else{
            res.send("no user")
        }
    }
    catch(err){
        res.send(err)
    }
})

app.use(authenticate);
app.use("/application", appRouter)

app.listen(process.env.PORT, async()=>{
    try{
        await connect
        console.log("server started")
    }
    catch(err){
        console.log("some error:",err)
    }
    
})