import api from './APIClient.js';

let howlTracker = 1;

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

function appendHowl( user, howl, isNew ) {
    var newHowl = document.createElement( 'div' );
    newHowl.id = howlTracker;
    howlTracker++;
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

    if ( isNew ) {
        document.querySelector( '.main-content' ).insertBefore( newHowl, document.getElementById( '1' ) );
    }
    else {
        document.querySelector( '.main-content' ).appendChild( newHowl );
    }
}

function addProfileEvent( username ) {
    username.addEventListener( 'click', function() {
        var username = this.textContent;
        username = username.slice( 1 );
        window.location.href = `/profile?username=${username}`;
    } );
}

document.addEventListener( 'DOMContentLoaded', function() {
    const howlButton = document.querySelector( '.howl-button' );
    const howlText = document.querySelector( '.howl-text' );

    const head = document.querySelector( 'h1' );

    head.addEventListener( 'click', function() {
        window.location.href = '/main';
    } );

    api.getFollowingHowls().then( followingHowls => {
        console.log( followingHowls );

        const users = followingHowls.map( howl => api.getUser( howl.userId ) );

        Promise.all( users ).then( users => {
            followingHowls.forEach( ( howl, index ) => {
                const user = users[ index ];
                appendHowl( user, howl, false );
            } );
        } );
    } );

    howlButton.addEventListener( 'click', function() {
        if ( howlText.value && howlText.value != "" ) {
            api.getCurrentUser().then( user => {
                let howly = new Object();
                howly.text = howlText.value;
                api.newHowl( howly, user.id ).then( howl => {
                    location.reload();
                    howlText.value = "";
                } );
            } );
        }
    } );

    let usernames = document.querySelectorAll( '.username' );
    usernames.forEach( username => {
        addProfileEvent( username );
    } );

} );