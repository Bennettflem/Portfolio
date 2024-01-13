const follows = require( '../data/follows.json' );
const users = require( '../data/users.json' );

module.exports = {

    getFollowing: ( userId ) => {
        return new Promise( ( resolve, reject ) => {
            let following = follows[ String( userId ) ].following;
            if ( following ) {
                resolve( following );
            }
            else {
                reject( "Unable to get following for user" + userId );
            }
        } );
    },

    toggleFollow: ( userId, current ) => {
        return new Promise( ( resolve, reject ) => {
            let currentFollowing = follows[ current.id ].following;

            if ( currentFollowing.includes( parseInt(userId) ) ) {
                currentFollowing.splice( currentFollowing.indexOf( parseInt(userId) ), 1 );
                console.log( userId + " unfollowed" );
                resolve( currentFollowing );
            }
            else if ( !currentFollowing.includes( parseInt(userId) ) ) {
                currentFollowing.push( parseInt(userId) );
                console.log( userId + " followed" );
                resolve( currentFollowing );
            }
            else {
                reject( "Unable to toggle following of user" + userId );
            }
        } );
    }

};