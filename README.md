# connect-ibmdatacache

**connect-ibmdatacache** is a IBM Datacache session store for Express/Node.js apps

## Setup

```sh
npm install connect-redis express-session
```

Pass the `express-session` store into `connect-redis` to create a `RedisStore` constructor.

```js
var session = require('express-session');
var IBMDataCacheStore = require('connect-ibmdatacache')(session);

app.use(session({
    store: new IBMDataCacheStore(options),
    secret: 'keyboard cat'
}));
```

## FAQ

### How does the data store know how to connect to the IBM Datacache service?

When deployed in IBM Bluemix, an app's attached services are found in the `VCAP_SERVICES` environment variable. This app looks for an attached IBM Datacache service and uses that to store session keys.

# License

Apache-2.0