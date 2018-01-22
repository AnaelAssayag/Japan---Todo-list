var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer  = require('multer');
var upload = multer();


mongoose.connect(process.env.CONNECTION_STRING||'mongodb://localhost/japanDB', function() {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:
// 1) to handle getting all posts and their comments
app.get('/posts', function(req,res){
  Post.find(function(error, result){
    if(error) throw error;
    res.send(result)
  })
});

// 2) to handle adding a post
app.post('/posts', function(req, res){
  var newPost = new Post(req.body);
  newPost.save(function(error, result){
    if(error) throw error;
    res.send(result)
  })
});


// 3) to handle deleting a post
app.delete('/posts/:id', function(req, res){
  var postId = req.params.id;
  Post.findByIdAndRemove(postId, function(error, result){
    if(error) throw error;
    res.send(result)
  })
});


// 4) to handle adding a comment to a post
app.post('/posts/:id/comments', function(req, res) {
  var postId = req.params.id;
  var newComment = req.body;
  Post.findByIdAndUpdate(postId, {$push: {comments:newComment}}, {new:true}, function(error, result) {
    if(error) throw error;
    res.send(result);
  })
});


// 5) to handle deleting a comment from a post
app.delete('/posts/:id/comments/:commentid', function(req, res){
  var postId = req.params.id;
  var commentId = req.body.commentId;
  Post.findById(postId, function(error, result){
    if(error) throw error;
    result.comments.id(commentId).remove();
    result.save();
    res.send();
  })
})

//6) add a priority on a step
app.post('/posts/:id/priority', function(req, res){
  var postId = req.params.id;
  console.log(postId)
  var priority = req.body.priority;
  console.log(priority)

  Post.findByIdAndUpdate(postId, {priority:priority}, {new:true}, function(error, result) {
    if(error) throw error;
    res.send(result);
  })
  });


  //7) Add photo

app.listen(process.env.PORT || '8080');
