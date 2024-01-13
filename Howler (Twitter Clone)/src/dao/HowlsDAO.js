const howls = require( '../data/howls.json' );
const follows = require( '../data/follows.json' );
const users = require( '../data/users.json' );

let idTracker = howls[ howls.length - 1 ].id;

module.exports = {

    getUserHowls: ( userId ) => {
        return new Promise( ( resolve, reject ) => {
            let userHowls = [];
            howls.forEach( howl => {
                if ( howl.userId == userId ) {
                    userHowls.push( howl );
                }
            } );
            if ( userHowls.length > 0 ) {
                userHowls.sort( ( a, b ) => {
                    let dateA = new Date( a.datetime );
                    let dateB = new Date( b.datetime );

                    return dateB - dateA;
                } );
                resolve( userHowls );
            }
            else {
                reject( "User has no howls" );
            }
        } );
    },

    getFollowingHowls: ( current ) => {
        return new Promise( ( resolve, reject ) => {
            console.log( "ayo " + current.username );
            let followingHowls = [];
            let user = users.find( user => user.username == current.username );
            let currentFollowing = follows[ "" + user.id ].following;
            console.log( user.id );
            console.log( currentFollowing);
            currentFollowing.forEach( userId => {
                howls.forEach( howl => {
                    if ( howl.userId == userId ) {
                        followingHowls.push( howl );
                    }
                } );
            } );
            howls.forEach( howl => {
                if ( howl.userId == user.id ) {
                    followingHowls.push( howl );
                }
            } );
            if ( followingHowls.length > 0 ) {
                followingHowls.sort( ( a, b ) => {
                    let dateA = new Date( a.datetime );
                    let dateB = new Date( b.datetime );
    
                    return dateB - dateA;
                } );
                resolve( followingHowls );
            }
            else {
                reject( "There are no following howls");
            }
        } );
    },

    newHowl: ( content, current ) => {
        return new Promise( ( resolve, reject ) => {
            console.log( "1" );
            let howl = new Object();
            console.log( "2" );
            idTracker++;
            howl.id = idTracker;
            howl.userId = current;
            console.log( "3" );
            let date = new Date();
            howl.datetime = date.toString();
            console.log( "555" );
            howl.text = content.text;
            console.log( "4" );
            if ( howl.text ) {
                howls.push( howl );
                resolve( howl );
            }
            else {
                reject( "Cannot add new howl" );
            }
        } );
    }

};