import api from './APIClient.js';

document.addEventListener( 'DOMContentLoaded', function() {
    const logoutButton = document.querySelector( ".logout-button" );
    const loginPage = document.querySelector( ".need-login" );

    logoutButton.addEventListener( 'click', function() {
        api.logOut();
        document.location = '/';
    } );

    loginPage.addEventListener( 'click', function() {
        document.location = '/';
    } );
} );

api.getCurrentUser().then( user => {
    document.querySelector( 'header' ).classList.replace( 'login-head', 'howler-head' );
    document.getElementById( 'main' ).classList.replace( 'hidden', 'main-content' );
    document.getElementById( 'user' ).style.display = "block";
    document.querySelector( '.username' ).textContent = "@" + user.username;
    document.getElementById( 'not-logged' ).style.display = "none";
} ).catch( error => {
    console.log( "We are not logged in" );
    document.location = '/';
    document.querySelector( 'header' ).classList.replace( 'howler-head', 'login-head' );
    document.getElementById( 'main' ).classList.replace( 'main-content', 'hidden' );
} );