const mongoose=require('mongoose');



const postSchema = new mongoose.Schema({
  //TODO : add views
  //maybe add like
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    defult:"others"
  },
  creator:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Author',
      required:true
  }
},{timestamps:true});


module.exports =mongoose.model('Post',postSchema)