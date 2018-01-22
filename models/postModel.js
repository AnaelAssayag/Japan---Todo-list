var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments


var commentSchema = new mongoose.Schema({
    text: String,
    user: String,

});


var postSchema = new mongoose.Schema({
    text: String,
    comments: [commentSchema],
    priority: Number

});

var Post = mongoose.model('post', postSchema);


var post1 = new Post ({text:"Tokyo", comments:[], priority:5})
var post2 = new Post({text:"Osaka", comments:[{text:"first week or last week", user:"Ana"}], priority:4})
var post3 = new Post({text:"Fuji", comments:[{text:"first week or last week", user:"Ana"}], priority:0})
// post3.save();

// post2.save();
// post1.save();

module.exports = Post
