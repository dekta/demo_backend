const express = require("express");

const {AppModel} = require("../models/app.model");

const appRouter = express.Router();

appRouter.use(express.json())

appRouter.get("/",async(req,res)=>{
    const app = await AppModel.find()
    res.send(app)
})

appRouter.post('/create',async(req,res)=>{
    const data = req.body
    try{
        const new_app = new AppModel(data);
        await new_app.save();
        console.log(new_app)
        res.send("application created")
    }
    catch(err){
        res.send(err)
    }
})

appRouter.patch("/update/:appId", async(req,res)=>{
    const appid  = req.params.appId;
    const userID = req.body.userID;
    const data = req.body
    try{
        const app = await AppModel.findOne({userID:appid})
        if(appid !== app.userID){
            console.log("hi")
            res.send("not valid id")
        }
        else{
           await AppModel.findByIdAndUpdate({_id:app._id},data);
           res.send("app updated")
        }
    }
    catch(err){
        res.send(err)
    }
        
})

appRouter.delete("/delete/:appId", async(req,res)=>{
    const appid  = req.params.appId;
    const userID = req.body.userID;
    const data = req.body
    try{
        const app = await AppModel.findOne({userID:appid})
        if(appid !== app.userID){
            res.send("not valid id")
        }
        else{
           await AppModel.findByIdAndDelete({_id:app._id});
           res.send("app deleted")
        }
    }
    catch(err){
        res.send(err)
    }
        
})


module.exports = {appRouter}
