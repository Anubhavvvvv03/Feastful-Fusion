const mongoose=require('mongoose');

const recipeSchema=new mongoose.Schema({
    name:{
        type: String,
        required:'This feild is required.'
    },
    description:{
        type: String,
        required:'This feild is required.'
    },
    email:{
        type: String,
        required:'This feild is required.'
    },
    ingredients:{
        type: Array,
        required:'This feild is required.'
    },
    category:{
        type: String,
        enum:['Thai','American','Chinese','Mexican','Indian','Spanish'],
        required:'This feild is required.'
    },
    image:{
        type: String,
        required:'This feild is required.'
    },
});

recipeSchema.index({name:'text' ,description: 'text'});

module.exports=mongoose.model('Recipe',recipeSchema);