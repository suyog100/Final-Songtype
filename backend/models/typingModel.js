const mongoose = require("mongoose");


const typingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }, 
    wpm:{
        type:[Number],
        
    }, 
    accuracies:{
        type:[Number],
    }
});

const typingModel = mongoose.model("typing", typingSchema);

module.exports = typingModel;