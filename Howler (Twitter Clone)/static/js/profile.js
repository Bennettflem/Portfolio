import api from './APIClient.js';

const urlParam = new URLSearchParams( window.location.search );
const username = urlParam.get( 'username' );

function formatDate( dateString ) {
    let date = new Date( dateString );

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure two-digit minutes
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
  
    return `${month} ${day}, ${hours}:${minutes}${ampm}`;
}

function populateFollowing( userId ) {
    api.getFollowing( userId ).then( following => {
        following.forEach( id => {
            api.getUser( id ).then( user => {
                let followed = document.createElement( 'div' );
                followed.classList.add( 'followed-user' );

                let avatar = document.createElement( 'img' );
                avatar.src = user.avatar;
                followed.appendChild( avatar );

                let name = document.createElement( 'div' );
                name.innerHTML = user.first_name + "<br>" + user.last_name;
                followed.appendChild( name );

                let username = document.createElement( 'div' );
                username.innerHTML = "@" + user.username;
                username.classList.add( 'username' );
                addProfileEvent( username );
                followed.appendChild( username );

                document.querySelector( '.follows-box' ).appendChild( followed );
            } );
        } );
    } );
}

function appendHowl( user, howl ) {
    var newHowl = document.createElement( 'div' );
    newHowl.classList.add( 'followed-howls' );

    var head = document.createElement( 'div' );
    head.classList.add( 'user-head' );

    var howlUser = document.createElement( 'div' );
    howlUser.classList.add( 'user-info' );

    var avatar = document.createElement( 'img' );
    avatar.src = user.avatar;
    howlUser.appendChild( avatar );

    var name = document.createElement( 'div' );
    name.innerHTML = user.first_name + " " + user.last_name;
    howlUser.appendChild( name );

    var username = document.createElement( 'div' );
    username.classList.add( 'username' );
    username.innerHTML = "@" + user.username;
    username.style.marginRight = "10%"
    addProfileEvent( username );
    howlUser.appendChild( username );
    head.appendChild( howlUser );

    var datetime = document.createElement( 'div' );
    datetime.innerHTML = formatDate( howl.datetime );
    head.appendChild( datetime );

    newHowl.appendChild( head );

    var text = document.createElement( 'p' );
    text.textContent = howl.text;
    newHowl.appendChild( text );
    newHowl.style.color = "black";

    document.querySelector( '.howls-box' ).appendChild( newHowl );
}

function addProfileEvent( username ) {
    username.addEventListener( 'click', function() {
        var username = this.textContent;
        username = username.slice( 1 );
        window.location.href = `/profile?username=${username}`;
    } );
}

document.addEventListener( 'DOMContentLoaded', function() {
    const head = document.querySelector( 'h1' );

    head.addEventListener( 'click', function() {
        window.location.href = '/main';
    } );

    if ( !username || username == JSON.parse( localStorage.getItem( 'current' ) ).username ) {
        api.getCurrentUser().then( user => {
            document.querySelector( '.avatar' ).src = user.avatar;
            document.querySelector( '.name-username' ).innerHTML = user.first_name + "<br>" + user.last_name + "<br>@" + user.username;
            document.querySelector( '.follow-button' ).style.visibility = "hidden";
            populateFollowing( user.id );
            api.getUserHowls( user.id ).then( userHowls => {
                userHowls.forEach( howl => {
                    appendHowl( user, howl );
                } );
            } );
        } );
    }
    else {
        api.getUser( username ).then( user => {
            document.querySelector( '.avatar' ).src = user.avatar;
            document.querySelector( '.name-username' ).innerHTML = user.first_name + "<br>" + user.last_name + "<br>@" + user.username;
            api.getFollowing( JSON.parse( localStorage.getItem( 'current' ) ).id ).then( following => {
                following.forEach( id => {
                    console.log( id );
                    console.log( user.id );
                    if ( id == user.id ) {
                        document.querySelector( '.follow-button' ).textContent = "Unfollow";
                    }
                } );
            } );
            populateFollowing( user.id );
            api.getUserHowls( user.id ).then( userHowls => {
                userHowls.forEach( howl => {
                    appendHowl( user, howl );
                } );
            } );
        } );
    }

    let usernames = document.querySelectorAll( '.username' );
    usernames.forEach( username => {
        addProfileEvent( username );
    } );

    let butt = document.querySelector( '.follow-button' )
    butt.addEventListener( 'click', function() {
        api.getUser( username ).then( user => {
            if ( butt.textContent == "Follow" ) {
                let id = new Object();
                id.id = JSON.parse( localStorage.getItem( 'current' ) ).id
                api.toggleFollow( user.id, id ).then( currentFollowing => {
                    console.log( currentFollowing );
                } );
                butt.textContent = "Unfollow";
            }
            else {
                let id = new Object();
                id.id = JSON.parse( localStorage.getItem( 'current' ) ).id
                api.toggleFollow( user.id, id ).then( currentFollowing => {
                    console.log( currentFollowing );
                } );
                butt.textContent = "Follow";
            }
        } );
    } );

} );