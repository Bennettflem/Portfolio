import HTTPClient from './HTTPClient.js';

export default {

    getUser: ( usernameParam ) => {
        return HTTPClient.get( `/api/user/${ usernameParam }` ).then( user => {
            console.log( user );
            return user;
        } );
    },

    getCurrentUser: () => {
        return HTTPClient.get( '/api/users/current' );
    },
    
    logIn: ( username, password ) => {
        let data = {
          username: username,
          password: password
        }
        return HTTPClient.post( '/api/login', data );
    },
    
    logOut: () => {
        return HTTPClient.post( '/api/logout', {} );
    },

    getFollowing: ( userId ) => {
        return HTTPClient.get( `/api/following/${ userId }` ).then( following => {
            console.log( following );
            return following;
        } );
    },

    toggleFollow: ( userId, current ) => {
        return HTTPClient.put( `/api/following/${ userId }`, current ).then( currentFollowing => {
            console.log( currentFollowing );
            return currentFollowing;
        } );
    },

    getUserHowls: ( userId ) => {
        return HTTPClient.get( `/api/howls/${ userId }` ).then( userHowls => {
            console.log( userHowls );
            return userHowls;
        } );
    },

    getFollowingHowls: () => {
        return HTTPClient.get( `/api/users/current/howls` ).then( followingHowls => {
            console.log( followingHowls );
            return followingHowls;
        } );
    },

    newHowl: ( content, current ) => {
        return HTTPClient.post( `/api/howls/${ current }`, content ).then( howl => {
            console.log( howl );
            return howl;
        } );
    }

}