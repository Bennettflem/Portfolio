const express = require('express');
const apiRouter = express.Router();
const cookieParser = require('cookie-parser');
apiRouter.use(cookieParser());

//API Routes
const UsersDAO = require('../dao/UsersDAO.js');
const FollowsDAO = require('../dao/FollowsDAO.js');
const HowlsDAO = require('../dao/HowlsDAO.js');

apiRouter.use(express.json());

const {TokenMiddleware, generateToken, removeToken} = require('../TokenMiddleware.js');

// Routes for User api
apiRouter.get( '/user/:user', TokenMiddleware, ( req, res ) => {
    UsersDAO.getUser( req.params.user ).then( user => {
        res.json( user );
    } ).catch( err => {
        res.json( {error: err} );
    } );
} );

apiRouter.post( '/login', ( req,  res ) => {
    if( req.body.username && req.body.password ) {
        UsersDAO.getUserByCredentials( req.body.username, req.body.password ).then( user => {
            let result = {
                user: user
            }
            generateToken( req, res, user );
            
            res.json( result );
        }).catch(err => {
            console.log( err );
            res.status( err.code ).json( { error: err.message } );
        });
        }
    else {
        res.status( 401 ).json( { error: 'Not authenticated' } );
    }
} );
  
apiRouter.post( '/logout', ( req,  res ) => {
    removeToken( req, res );

    res.json({success: true});
} );
  
  
apiRouter.get( '/users/current', TokenMiddleware, ( req, res ) => {
    res.json( req.user );
} );

// Routes for Following api
apiRouter.get( '/following/:userId', TokenMiddleware, ( req, res ) => {
    FollowsDAO.getFollowing( req.params.userId ).then( following => {
        res.json( following );
    } ).catch( err => {
        res.json( { error: err } );
    } );
} );

apiRouter.put( '/following/:userId', TokenMiddleware, ( req, res ) => {
    FollowsDAO.toggleFollow( req.params.userId, req.body ).then( currentFollowing => {
        res.json( currentFollowing );
    } ).catch( err => {
        res.json( { error: err } );
    } );
} );

// Routes for Howls api
apiRouter.get( '/howls/:userId', TokenMiddleware, ( req, res ) => {
    HowlsDAO.getUserHowls( req.params.userId ).then( userHowls => {
        res.json( userHowls );
    } ).catch( err => {
        res.json( { error: err } );
    } );
} );

apiRouter.get( '/users/current/howls', TokenMiddleware, ( req, res ) => {
    console.log( "hai " + JSON.stringify(req.user) );
    HowlsDAO.getFollowingHowls( req.user ).then( followingHowls => {
        res.json( followingHowls );
    } ).catch( err => {
        res.json( { error: err } );
    } );
} );

apiRouter.post( '/howls/:current', TokenMiddleware, ( req, res ) => {
    HowlsDAO.newHowl( req.body, req.params.current ).then( howl => {
        res.json( howl );
    } ).catch( err => {
        res.json( { error: err } );
    } );
} );

module.exports = apiRouter;