const crypto = require('crypto');
const base64url = require('base64url');

const TOKEN_COOKIE_NAME = "HowlerToken";

const API_SECRET = "60d0956e20eaa0c02b482071c33c53bc18522Cc6d4805eAa02e182b0";

exports.TokenMiddleware = ( req, res, next ) => {
  let token = null;

  if ( !req.cookies[ TOKEN_COOKIE_NAME ] ) {
    console.log("yessir");
    const authHeader = req.get( 'Authorization' );
    if( authHeader && authHeader.startsWith( "Bearer " ) ) {
      console.log("OH YEAAA");
      token = authHeader.split(" ")[1];
    }
  }
  else {
    console.log("Now we talkig");
    token = req.cookies[ TOKEN_COOKIE_NAME ];
    console.log(typeof token);
    console.log( token );
  }

  if ( !token ) {
    console.log( "HIIIIIII" );
    res.status( 401 ).json( { error: 'Not Authenticated' } );
    return;
  }

  const [ encodedHeader, encodedPayload, signature ] = token.split( '.' );
  
  const payload = JSON.parse( base64url.decode( encodedPayload ) );
  const user = payload.user;
  const exp = payload.exp;
  let timeNow = Math.floor( Date.now() / 1000 );
  
  const testSig = crypto.createHmac( 'sha256', API_SECRET );
  testSig.update( encodedHeader + '.' + encodedPayload );
  testSigString = testSig.digest( 'base64url' );

  console.log( "Test: " + testSigString.toString() );
  console.log( "Real: " + signature.toString() );

  if ( exp < timeNow ) {
    res.status( 401 ).json( { error: 'Token Expired' } );
    return;
  }
  else if ( testSigString.toString() === signature.toString() ) {
    req.user = user;
    next();
  }
  else {
    res.status( 401 ).json( { error: 'Not authenticated' } );
    return;
  }

}

exports.generateToken = ( req, res, user ) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    exp: Math.floor( Date.now() / 1000 ) + ( 10 * 60 ),
    user: user
  };

  const encodedHeader = base64url( JSON.stringify( header ) );
  const encodedPayload = base64url( JSON.stringify( payload ) );

  const signature = crypto.createHmac( 'sha256', API_SECRET );
  signature.update( encodedHeader + '.' + encodedPayload );
  sig = signature.digest( 'base64url' );

  const token = encodedHeader + "." + encodedPayload + "." + sig;

  res.cookie( TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60 * 1000
  } );

  //for checking token in io, remove later
  console.log( "YOOO" + token );

};

exports.removeToken = ( req, res ) => {
  res.cookie( TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000
  } );
}