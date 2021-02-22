if(!localStorage.getItem('followers')) {
  localStorage.setItem('followers', 0)
}

document.addEventListener('DOMContentLoaded', function() {

  // display new post form
  new_post();
  
  // get logged in user
  const name = document.querySelector('#profile-link').innerHTML;

  // use navbar links to toggle between views
  document.querySelector('#all_posts_link').addEventListener('click', () => load_page('allposts'));
  document.querySelector('#following_link').addEventListener('click', () => load_page('following'));
  document.querySelector('#profile-link').addEventListener('click', () => profile(name));
  
  //display all posts by default
  load_page('allposts');
});


function new_post() {
  // clear out post field
  document.querySelector('#post_area').value = '';

  // save post -not working becuse of csrf_token
  document.querySelector('#new-post-form').onsubmit = function() {
    fetch('network/posts', {
      method:'POST',
      body: JSON.stringify({
        text: document.querySelector('#post_area').value,
      }),
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        new_post();
        load_page('allposts');
      })
      .catch(error => {
      console.error();
      })
    // don`t submit the form
    return false;
  }
}


function load_page(link) {
  // by default show the new post form and hide profile detailes
  document.querySelector('#new_post_view').style.display = 'block';
  document.querySelector('#profile_view').style.display = 'none';
  fetch(`network/${link}`)
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
    list_posts(posts); 
  })
  .catch(error => {
    console.log(error);
  });
}


function list_posts(posts) {
  document.querySelector('#posts-list').innerHTML ='';
  for (let i = 0; i < posts.length; i++) {
    const div = document.createElement('div');
    div.innerHTML = `
      <li>
        <a href="#">
          <h6 id="profile_${posts[i].id}">${posts[i].user_id}</h6>
        </a>
      </li>
      <li>
        <button id="edit_${posts[i].id}" class="btn btn-link" type="button" name="button">Edit</button>
      </li>
      <li>${posts[i].text}</li>
      <li class="text-muted"><small>${posts[i].timestamp}</small></li>
      <li class="text-muted">
        <button type="button" class="btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
            <path d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
          </svg>
      <!-- filled heart black
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
          </svg>
      -->
        </button>
        <span id="likes">${posts[i].likes}</span>
      </li>
      <li>
        <button id="comment_${posts[i].id}" class="btn btn-link" type="button" name="button">Comment</button>
      </li>
      <hr/>
    `
    document.querySelector('#posts-list').append(div)
    document.querySelector(`#profile_${posts[i].id}`).addEventListener('click', () => profile(`${posts[i].user_id}`));
  }
}


function profile(user_name) {
  load_page(user_name)
  // show profile and hide the the new post form
  document.querySelector('#new_post_view').style.display = 'none';
  document.querySelector('#profile_view').style.display = 'block';

  // hide the follow button by default
  document.querySelector('#follow_button').style.display = 'none';

  // display profile username
  document.querySelector('#profile_name').innerHTML = `Username: <b>${user_name}</b>`;

  // get user data
  fetch(`profile/${user_name}`)
  .then(response => response.json())
  .then(user_profile => {
    console.log(user_profile);

    document.querySelector('#profile_followers').innerHTML = `Followers: ${user_profile.followers.length}`;
    document.querySelector('#profile_following').innerHTML = `Following: ${user_profile.following.length}`;
    // update localStorage
    localStorage.setItem('followers', user_profile.followers.length)
    
    // get the name of the user who is logged in
    const logged_in_user = document.querySelector('#profile-link').innerHTML;
    
    // show the follow/unfollow button state
    if (user_profile.username !== logged_in_user) {
      document.querySelector('#follow_button').style.display = 'block';
      document.querySelector('#follow_button').innerHTML = "Follow";

      for (let i = 0; i < user_profile.followers.length; i++) {
        if(user_profile.followers[i] == logged_in_user) {
          document.querySelector('#follow_button').innerHTML = "Unfollow";
        }
      }
    }
  })
  .catch(error => {
    console.log(error);
  });

  // following button
  document.querySelector('#follow_button').addEventListener('click', () => {
    if (document.querySelector('#follow_button').innerHTML === "Follow") {
        follow(user_name); 
    }
    else {
        unfollow(user_name);
    }   
})
}


function follow(person) {
  fetch(`profile/${person}`, {
    method: 'PUT',
    body: JSON.stringify({
      following: person,
      action: "follow"
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    console.log(person); 
    document.querySelector('#follow_button').innerHTML = "Unfollow";
    // display unpdated number of followers
    let f = localStorage.getItem('followers');
    f++;
    document.querySelector('#profile_followers').innerHTML = `Followers: ${f}`;
    localStorage.setItem('followers', f);
  })
}


function unfollow(pperson) {
  fetch(`profile/${pperson}`, {
    method: 'PUT',
    body: JSON.stringify({
      following: pperson,
      action: "unfollow"
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    console.log(pperson);
    document.querySelector('#follow_button').innerHTML = "Follow";
    // display updated number of followers
    let f = localStorage.getItem('followers');
    f--;
    document.querySelector('#profile_followers').innerHTML = `Followers: ${f}`;
    localStorage.setItem('followers', f);
  })
}
