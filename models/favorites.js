const { model } = require('mongoose');
const mongoose =require('mongoose');
const Schema=mongoose.Schema;


var favoriteSchema=new Schema({
    user:  {
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dishes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Dish'
        },
    ]
},{
    timestamps: true,
    usePushEach: true

});

var Favorites=mongoose.model('Favorite',favoriteSchema);

module.exports=Favorites;