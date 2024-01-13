import api from './APIClient.js';

// key for current user in Web storage
const CURRENT_USER = 'current';

document.addEventListener( 'DOMContentLoaded', function() {
    const loginButton = document.querySelector( '.login-submit' );
    const usernameInput = document.querySelector( '.username-input' );
    const passInput = document.querySelector( '.password-input' );
    const errorBox = document.getElementById( 'errorbox' );

    loginButton.addEventListener( 'click', function( e ) {
        errorBox.classList.add( "hidden" );

        api.logIn( usernameInput.value, passInput.value ).then( userData => {
            localStorage.setItem( CURRENT_USER, JSON.stringify( userData.user ) );
            window.location.href = "/main";
        } ).catch( ( err ) => {
            errorBox.classList.remove( "hidden" );
            errorBox.style.color = "#d6ca18";
            errorBox.innerHTML = "Unable to Login";
        } );
    } );
} );