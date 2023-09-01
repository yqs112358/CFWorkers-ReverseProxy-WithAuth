# Simple Reverse Proxy with Http-Basic Auth via Cloudflare Workers

> Forked from https://github.com/dommmel/cloudflare-workers-basic-auth and add simple reverse proxy

## Attention!
Never create reverse proxy on Cloudflare Workers **without auth protection**! 

- Services without auth may be abused, and then lead to your CloudFlare account being locked.
- Use this project to protect your proxy behind http-basic auth.

## Usage
1. Set secrets and target host name in `index.js`
```javascript
const SECRET = "your-secret";               // Set your secret key here
const HOST_NAME = "target-website.com";     // Set target website you want to proxy here
```
2. Save and copy `index.js` to your CloudFlare worker, then deploy
3. Visit `https://your-secret@xxx.workers.dev` to pass http-basic auth and access target website through proxy
