var JapanApp = function() {

  var posts = [];

  var $posts = $(".posts");

  _renderPosts();

var fetch = function() {
  $.ajax({
    type: "GET",
    url: "/posts",
    success: function(data) {
      posts = data;
      _renderPosts();

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
  }
  });
}

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var dataTemplate = posts[i];
      dataTemplate["star_off_1"] = posts[i].priority < 1;
      dataTemplate["star_off_2"] = posts[i].priority < 2;
      dataTemplate["star_off_3"] = posts[i].priority < 3;
      dataTemplate["star_off_4"] = posts[i].priority < 4;
      dataTemplate["star_off_5"] = posts[i].priority < 5;


      var newHTML = template(dataTemplate);
      $posts.append(newHTML);
      _renderComments(i)

    }

  }


  function addPost(newPost) {
    $.ajax({
      method:"POST",
      url:"/posts",
      data:{ text: newPost, comments: [], priority:0},
      success: function(data) {
        posts.push(data);
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    }

    });
  };


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function(index, postId) {
    $.ajax({
      method:"DELETE",
      url:"/posts/" + postId,
      // data:{ text: newPost, comments: [] },
      success: function(data) {
        posts.splice(index, 1);
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
    }

    });
  };

  var addComment = function (newComment, postIndex, postId) {
    $.ajax({
      type: "POST",
      url: "/posts/" + postId + "/comments",
      data: newComment,
      success: function (data) {
        posts[postIndex].comments = data.comments;
        _renderComments(postIndex);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };




  var deleteComment = function(postIndex, commentIndex, postId, commentId) {
  $.ajax({
    type: "DELETE",
    url: "/posts/" + postId + "/comments/" + commentId,
    data: { commentId: commentId },
    success: function (data) {
      posts[postIndex].comments.splice(commentIndex, 1);
      _renderComments(postIndex);

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
};
  var addPriority = function (starValue, postId){
  $.ajax({
    type: "POST",
    url: "/posts/" + postId + "/priority",
    data: {priority:starValue},
    success: function (data) {
      for(var i =0; i< posts.length; i++) {
        if(posts[i]._id == postId) {
          posts[i].priority = data.priority
          _renderPosts();   
     }
    }
   

    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });
}

  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
    addPriority: addPriority,
    fetch:fetch
  };
};

var app = JapanApp();
app.fetch();


$('#addpost').on('click', function() {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function() {
  var index = $(this).closest('.post').index();
  var postId = $(this).data().id;
  app.removePost(index, postId);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };
  var postId = $(this).closest('.post').find('.remove-post').data().id;

  app.addComment(newComment, postIndex, postId);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();
  var commentId = $(this).data().id;
  var postId = $(this).closest('.post').find('.remove-post').data().id;

  app.deleteComment(postIndex, commentIndex, postId, commentId);
});

$posts.on('click', '.rating-star', function(){
  var postId = $(this).closest('.post').find('.remove-post').data().id;
  var starValue = $(this).data().value;

  app.addPriority(starValue, postId); 
})

