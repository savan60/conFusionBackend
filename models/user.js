var mongoose =require('mongoose');
var Schema=mongoose.Schema;
var passwordLoclMongoose=require('passport-local-mongoose');
var User=new Schema({
    admin:{
        type:Boolean,
        default:false
    }
});

User.plugin(passwordLoclMongoose);

module.exports=mongoose.model('User',User);