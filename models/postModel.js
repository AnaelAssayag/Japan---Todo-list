var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments


var commentSchema = new mongoose.Schema({
    text: String,
    user: String

});


var postSchema = new mongoose.Schema({
    text: String,
    image: String,
    comments: [commentSchema]

});

var Post = mongoose.model('post', postSchema);

var comment1 = new Post({ text: "Hi", comments: [{text:"hi", user:"Anael"}]});
var comment2 = new Post({text: "want to test you", comments: [{text:"ole",user:"Yo"}] })
var post1 = new Post ({text:"Tokyo", comments:[]})
var post2 = new Post({text:"Osaka", comments:[{text:"first week or last week", user:"Ana"}]})
var post3 = new Post({text:"Osaka",image:"https://photos.smugmug.com/Osaka/Osaka-Categories/i-VBQQVb8/0/XL/Osaka_Itineraries-XL.jpg" ,comments:[{text:"Hi", user:"Ana"}]})
// post3.save();
// post2.save();
// post1.save();
// comment1.save();
// comment2.save();

module.exports = Post
