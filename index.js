const SECRET = "your-secret";               // Set your secret key here
const HOST_NAME = "target-website.com";     // Set target website you want to proxy here

//const PASS = "";

/**
 * RegExp for basic auth credentials
 *
 * credentials = auth-scheme 1*SP token68
 * auth-scheme = "Basic" ; case insensitive
 * token68     = 1*( ALPHA / DIGIT / "-" / "." / "_" / "~" / "+" / "/" ) *"="
 */

const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/;

/**
 * RegExp for basic auth user/pass
 *
 * user-pass   = userid ":" password
 * userid      = *<TEXT excluding ":">
 * password    = *TEXT
 */

const USER_PASS_REGEXP = /^([^:]*):(.*)$/;

/**
 * Object to represent user credentials.
 */

const Credentials = function(name, pass) {
  this.name = name;
  this.pass = pass;
}

/**
 * Parse basic auth to object.
 */

const parseAuthHeader = function(string) {
  if (typeof string !== 'string') {
    return undefined;
  }

  // parse header
  const match = CREDENTIALS_REGEXP.exec(string);

  if (!match) {
    return undefined;
  }

  // decode user pass
  const userPass = USER_PASS_REGEXP.exec(atob(match[1]));

  if (!userPass) {
    return undefined;
  }

  // return credentials object
  return new Credentials(userPass[1], userPass[2]);
}


const unauthorizedResponse = function(body) {
  return new Response(
    body, {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="User Visible Realm"'
      }
    }
  );
}

/**
 * Handle request
 */

async function handle(request) {
  const credentials = parseAuthHeader(request.headers.get("Authorization"));
  if ( !credentials || credentials.name !== SECRET /*||  credentials.pass !== PASS*/) {
    return unauthorizedResponse("Unauthorized");
  } else {
    // ok
    let url = new URL(request.url);
    if (url.pathname.startsWith('/')) {
      url.hostname = HOST_NAME;
      let new_request = new Request(url, request);
      return fetch(new_request);
    }
    return fetch(request);
  }
}

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
})