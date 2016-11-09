"use strict";
let apiKeys = {};
let FbAPIKeys = {};
let uid = "";

console.log("jqeury connected");

  function putTodoInDOM(){
  FbAPI.getTodos(FbAPIKeys, uid).then(function(movies){
    console.log("movies from FB", movies);
    $('#movies-to-watch').html('');
    $('#movies-already-viewed').html('');
    movies.forEach(function(movie){
     if(movie.watched === true){
      let newListItem ='<div  class="card card-outline-success text-xs-center" data-completed="${movie.watched}">';
          newListItem+= '<img class="card-img-top" src="http://placehold.it/200x100" alt="Card image cap">';
            newListItem+= '<div class="card-block">';
              // newListItem+= `<li data-completed="${movie.watched}">`;
              newListItem+=`<h4 class="card-title">${movie.name}</h4>`;
              newListItem+='<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>';
              // newListItem+='Watched<input class="checkboxStyle" type="checkbox" checked>';
              // newListItem+='<ul class="list-group list-group-flush">';
              // newListItem+= '<li class="list-group-item">actor</li>';
              // newListItem+= '<li class="list-group-item">actor</li>';
              // newListItem+= '<li class="list-group-item">actor</li>';
              // newListItem+= '</ul>';
              // newListItem+= '<div class="card-block">';
              // newListItem+= '<a href="#" class="card-link">Card link</a>';
              // newListItem+= '<a href="#" class="card-link">Another link</a>';
              // newListItem+= '</div>';
              newListItem+='<button type="button" href="#" class="btn btn-primary">Watched</button>';
              // newListItem+='</li>';
            newListItem+='</div>';
      newListItem+='</div>';
        //apend to list
        $('#movies-to-watch').append(newListItem);
      }else{
        let newListItem ='<div  class="card card-outline-success text-xs-center" data-completed="${movie.watched}">';
          newListItem+= '<img class="card-img-top" src="http://placehold.it/200x100" alt="Card image cap">';
            newListItem+= '<div class="card-block">';
              newListItem+=`<h4 class="card-title">${movie.name}</h4>`;
              newListItem+='<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>';
              newListItem+='<button type="button" href="#" class="btn btn-success">Rate Movie <i class="fa fa-star-o" aria-hidden="true"></i></button>';
            newListItem+='</div>';
      newListItem+='</div>';
        //apend to list
        $('#movies-already-viewed').append(newListItem);
        }
      });
    });
  }

	function putMovieInDOM (searchValue){
  			movieAPI.getMovie(apiKeys,searchValue).then(function(items){
      			console.log("items from movie call in ajaxCalls.js", items);
		      	let newListItem = "";
		          newListItem+=`<div class="col-xs-8"><h4>${items.Title}</h4></div>`;
		          $('#movie-search-results').append(newListItem);
    });
  }

	function createLogoutButton(){
	  FbAPI.getUser(FbAPIKeys,uid).then(function(userResponse){
	    $('#logout-container').html('');
	    let currentUsername = userResponse.username;
	    let logoutButton = `<button class="btn btn-danger" id="logoutButton">LOGOUT ${currentUsername}</button>`;
	    $('#logout-container').append(logoutButton);
	  });
	}
$(document).ready(function(){ 
	movieAPI.movieCredentials().then(function(keys){
	    apiKeys = keys;
	     console.log("apiKeys",apiKeys );
	     // putMovieInDOM();
	     // firebase.initializeApp(apiKeys);
	});

	FbAPI.firebaseCredentials().then(function(keys){
 	     console.log("FBkeys", keys);
 	     FbAPIKeys = keys;
 	     firebase.initializeApp(FbAPIKeys);
 	     // putTodoInDOM();
 	   });


	$('#registerButton').on('click',function(){
      let email = $('#inputEmail').val();
      let password = $('#inputPassword').val();
      let username = $('#inputUsername').val();
      let user = {
        "email": email,
        "password": password
     	};
      FbAPI.registerUser(user).then(function(registerResponse){
        console.log("register response",registerResponse);
        let newUser = {
          "username": username,
          "uid": registerResponse.uid
        };
        let uid = registerResponse;
        return FbAPI.addUser(FbAPIKeys, newUser);
      }).then(function(adduserResponse){
        return FbAPI.loginUser(user);
      }).then(function(loginResponse){
        console.log("login response", loginResponse);
        uid = loginResponse.uid;
        createLogoutButton();
        putTodoInDOM();
        //hide is a bootstrap class
        $('#login-container').addClass("hide");
        $('#movie-search-view').removeClass("hide");
        $('#user-movie-view').removeClass("hide");
      });
    });


    $('#loginButton').on('click',function(){
      let email = $('#inputEmail').val();
      let password = $('#inputPassword').val();
      let user = {
        "email": email,
        "password": password
      };
      FbAPI.loginUser(user).then(function(loginResponse){
        uid = loginResponse.uid;
        createLogoutButton();
        putTodoInDOM();
        $('#login-container').addClass("hide");
        $('#movie-search-view').removeClass("hide");
        $('#user-movie-view').removeClass("hide");

      });
    });

    
    $('#logout-container').on('click','#logoutButton',function(){
        FbAPI.logoutUser();
        uid = "";
        $('#incomplete-tasks').html('');
        $('#completed-tasks').html('');
        $('#login-container').removeClass('hide');
        $('#movie-search-view').addClass('hide');
        $('#user-movie-view').addClass('hide');
        $('#inputEmail').val('');
        $('#inputPassword').val('');
        $('#inputUsername').val('');
        $('#inputEmail').focus();
    });

    $('#movie-search-button').on('click',function(){
        console.log('movie-search-button clicked!');
        putMovieInDOM($('#movie-name').val());

    });
});
