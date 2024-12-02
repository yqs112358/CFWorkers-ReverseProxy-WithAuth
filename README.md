# Simple Reverse Proxy with Http-Basic Auth via Cloudflare Workers

> Forked from https://github.com/dommmel/cloudflare-workers-basic-auth and add simple reverse proxy

## Attention!
Never create reverse proxy on Cloudflare Workers **without auth protection**! 

- Services without auth may be abused, and then lead to your CloudFlare account being locked.
- Use this project to protect your reverse proxy behind http-basic auth.

## Usage
1. Create a new CloudFlare worker
2. Copy the code from [index.js](https://github.com/yqs112358/CFWorker-BasicAuth-Reverse-Proxy/blob/master/index.js) to CloudFlare worker's code editor
3. Set reverse parameters at the top of `index.js`
```javascript
const SECRET    = "your-secret";           // Set your secret key
const HOST_NAME = "target-website.com";    // Set target hostname you want to proxy (For example: "somewebsite.com" / "anotherwebsite.net:12345")
const SUB_PATH  = "/";                     // Set the sub-path you want to proxy ("/" in default)
```
4. Save and deploy your CloudFlare worker
5. Visit `https://your-secret@xxx.workers.dev` to pass http-basic auth and access target website through proxy
