const SECRET    = "your-secret";           // Set your secret key
const HOST_NAME = "target-website.com";    // Set target hostname you want to proxy (For example: "somewebsite.com" / "anotherwebsite.net:12345")
const SUB_PATH  = "/";                     // Set the sub-path you want to proxy ("/" in default)


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


const Credentials = function(name, pass) {
  this.name = name;
  this.pass = pass;
}

const parseAuthHeader = function(string) {
  if (typeof string !== 'string') {
    return undefined;
  }

  const match = CREDENTIALS_REGEXP.exec(string);
  if (!match) {
    return undefined;
  }

  const userPass = USER_PASS_REGEXP.exec(atob(match[1]));
  if (!userPass) {
    return undefined;
  }
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
  if(SECRET !== "") {
    const credentials = parseAuthHeader(request.headers.get("Authorization"));
    // treat "username" slot as the auth-secret
    if(!credentials || credentials.name !== SECRET) {
      return unauthorizedResponse("Unauthorized");
    } 
  }

  let url = new URL(request.url);
  // rewrite hostname and port
  url.host = HOST_NAME;
  // rewrite sub-path if needed
  if (SUB_PATH !== "" && SUB_PATH !== "/"){
    let newPath = SUB_PATH + url.pathname;
    url.pathname = newPath;
  }

  let new_request = new Request(url, request);
  return fetch(new_request);
}

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
})
