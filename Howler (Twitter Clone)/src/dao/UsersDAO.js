const users = require( '../data/users.json' );
const crypto = require('crypto');

module.exports = {

    getUser: ( userParam ) => {
        return new Promise( ( resolve, reject ) => {
            let user;
            console.log( userParam );
            if ( !isNaN( Number( userParam ) ) ) {
                user = users.find( user => user.id == userParam );
            }
            else {
                user = users.find( user => user.username == userParam );
            }
            if ( user ) {
                resolve( getFilteredUser( user ) );
            }
            else {
                reject( "User not found" );
            }
        } );
    },

    getUserByCredentials: ( username, password ) => {
        return new Promise( ( resolve, reject ) => {
            const user = users.find( user => user.username == username );
            if ( user ) { // we found our user
                crypto.pbkdf2( password, user.salt, 100000, 64, 'sha512', ( err, derivedKey ) => {
                    if ( err ) { //problem computing digest, like hash function not available
                        reject( { code: 400, message: "Error: " + err } );
                    }
          
                    const digest = derivedKey.toString( 'hex' );
                    if ( user.password == digest ) {
                        resolve( getFilteredUser( user ) );
                    }
                    else {
                        reject( { code: 401, message: "Invalid username or password" } );
                    }
                } );
            }
            else { // if no user with provided username
                reject( { code: 401, message: "No such user" } );
            }
        } );
    
    }

};

function getFilteredUser( user ) {
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "avatar": user.avatar
    }
}