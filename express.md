# Node as a web server

## Table of contents

- Node as a web server
- Express
- Static files
- Template engine
- Processing input (forms)
- Session handling
- Persisting to files
- Authentication and authorization

## References

- [Express](https://expressjs.com/)

## Application server concepts

![](http://webprogramozas.inf.elte.hu/webeng/web-app-models.png)

## Node as a web server

### http module

Node has a built-in `http` module to handle HTTP requests and responses listening on a specific TCP port. But the `http` module is very low-level, and it would take a lot of effort to build an application around it.

```js
var http = require('http');

var port = process.env.PORT || 3000;
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello browser!\n');
}).listen(port);
```

### From http module to express

[This article](http://evanhahn.com/understanding-express/) shows the road from the `http` module through the middleware concept of the `connect` module to the main concepts of an `express` application.

### Minimal express application

First install the `express` module: `npm install --save express`. And then write the most minimal express web server:

```js
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
app.listen(port);
```

You can use a callback on startup:

```js
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Server is running!');
});
```

Or you can use it with the `http` module:

```js
var express = require('express');
var http = require('http');

var app = express();

var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
```

### Express basic concepts

Serving a request is nothing else but taking the HTTP request informations and producing an HTTP response. In an express application this process is handled by a sequence of dedicated functions, the middlewares and endpoints.

- HTTP request: `request` object
    + URI
    + HTTP method
    + (data)
    + headers
- --> HTTP response: `response` object
    + status
    + mime-type
    + content
    + headers
- processing: middlewares and route handlers

### Middleware

[Middleware](http://expressjs.com/en/guide/writing-middleware.html) is a **function**, which has access to the

- request object (`request`)
- response object (`response`)
- next middleware (`next`)

```js
function (request, response, next) {

}
```

A middleware

- can run any code;
- can change the request and response object;
- can close the request-response process;
- can call the next middleware.

```js
function (request, response, next) {
    //arbitrary code
    //reading/writing the request, response object
    next();
}
```

### Using the middlewares

[Documentation](http://expressjs.com/en/guide/using-middleware.html)

```js
//General form
app.use([path], middleware [, middleware]);

//Hit by any route
app.use(function (req, res, next) {
    console.log('Middleware');
    next();
});

//Run on every route starting with '/users'
app.use('/users', function (req, res, next) { /*...*/ });

//Example endpoint
app.use(function (req, res, next) {
    console.log('Endpoint');
});
```

### Express application

The express application is a series of middlewares ending with an endpoint:

```
middleware
middleware-->middleware
middleware
middleware
middleware-->endpoint
```

### Routing

[Routing](http://expressjs.com/en/guide/routing.html) is assigning an URI endpoint to a route handler (controller).

URIs with endpoints:

```
http://expressjs.com/guide/routing.html
http://localhost:8080/snippets/3
```

### Route

- URI (`path`)
- HTTP method (`METHOD`)
- one or more route handler (`handler`)

```js
//Generally
app.METHOD(path, handler [, handler ...]);
app.METHOD(path [, middleware, ...] handler);

//For example
app.get('/apple', function (req, res) {
    //code
});
```

### Route methods

- `get`
- `post`
- `put`
- `delete`
- `options`
- etc.
- `all`

[Full list of route methods](http://expressjs.com/4x/api.html#app.METHOD)

### Route paths

```js
//szöveg
app.get('/apple', function (req, res) { /* ... */ });
app.get('/public/index.html', function (req, res) { /* ... */ });

//szövegminta
app.get('/ab?cd', ...);     //acd or abcd
app.get('/ab+cd', ...);     //abcd, abbcd, abbbcd, ...
app.get('/ab*cd', ...);     //abcd, ab1cd, abSOMETHINGcd
app.get('/ab(cd)?e', ...);  //abe, abcde

//reguláris kifejezés
app.get(/apple/, ...);       //apple
app.get(/.*apple$/, ...);    //apple, chapple, redapple
```

### Route handlers

- Arbitrary middleware
- Without calling `next()` (endpoint)

```js
app.get('/', function (req, res) { /*...*/ });
app.get('/', function (req, res, next) {
    console.log('middleware');
    next();
}, function (req, res) {
    console.log('end');
})
app.get('/', middleware1, middleware2, middleware3);
app.get('/', [middleware1, middleware2, middleware3]);
```

### Types of middlewares

```js
//Application-level
app.use(...);

//Router-level
var router = express.Router();
router.use(...)

//Endpoint-level
app.get('/apple', middleware1, middleware2, middleware3);
app.use('/apple', middleware1, middleware2, middleware3);
router.get('/apple', middleware1, middleware2, middleware3);

//error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Server side error!');
});

//plugin
app.use(express.static('public'));
app.use(cookieParser());
```

### `route()` method

```js
app.get ('/apple', function (req, res) { /*...*/ });
app.post('/apple', function (req, res) { /*...*/ });
app.put ('/apple', function (req, res) { /*...*/ });

//the above code can be written in this way:

app.route('/apple')
    .get (function (req, res) { /*...*/ })
    .post(function (req, res) { /*...*/ })
    .put (function (req, res) { /*...*/ });
```

### Router

- Modularized route handling
- Isolated routes
- full-featured middleware and endpoint handling
- kind of mini-application
- or: app is extended with Router functionality
- Router is a middleware

### Defining and using the Router

```js
//apple.js
//Definition
var express = require('express');
var router = express.Router();

// middleware only for this router
router.use(function (req, res, next) { /*...*/ next(); });

// endpoints only for this router
router.get('/', function(req, res) { /*...*/ });
router.get('/apple', function(req, res) { /*...*/ });

module.exports = router;
```

```js
//Usage
var apple = require('./apple')

// /public and /public/apple 
app.use('/public', apple);
```

### The request object

- `req.path`
- `req.ip`
- `req.get()`
- `req.params`
- `req.body`

### The response object

- `res.download()`: downloading a file
- `res.end()`: end of response
- `res.json()`: JSON answer
- `res.jsonp()`: JSON answer in JSONP format
- `res.redirect()`: redirection
- `res.render()`: displaying a view template
- `res.send()`: different kind of answers
- `res.sendFile()`: reading and outputing a file

[Response documentation](http://expressjs.com/4x/api.html#res)


## Serving static content

### express.static middleware

- `express.static(root [, options])`
- [Description](http://expressjs.com/en/starter/static-files.html)
- Accessing `public/apple.html` file: `/apple.html`

```js
app.use(express.static('public'));
```

## Page templates

### Setting up a template engine

Express can use a great variety of [template engines](http://expressjs.com/en/guide/using-template-engines.html. For example:

- [nunjucks](https://mozilla.github.io/nunjucks/)
- [ejs](http://www.embeddedjs.com/)
- pug
- hogan
- dust
- or even [thymeleaf](https://www.npmjs.com/package/thymeleaf)

For example:

```js
app.set('views', './views');
app.set('view engine', 'ejs')
```

### Nunjucks

[Nunjucks](https://mozilla.github.io/nunjucks/)

First install nunjucks: `npm install --save nunjucks`

The template:

```html
{{ variable }}

{{ foo | join(",") }}

{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}

{% for item in items %}
  <li>{{ item.title }}</li>
{% else %}
  <li>This would display if the 'item' collection were empty</li>
{% endfor %}
```

Displaying a template (rendering):

```js
const app = express();
const nunjucks = require('nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
    res.render('index.html', {
        name: 'Győző'
    });
});
```

where the template is in `views/index.html`:

```html
<h1>Hello {{ name }}!</h1>
```

### Layout

Nunjucks calls it [template inheritence](https://mozilla.github.io/nunjucks/templating.html#template-inheritance). First you have to define the layout, indicating the dynamic parts with `block`s that child templates can override.

`views/layout.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    {% block head %}
    <link rel="stylesheet" href="style.css" />
    <title>{% block title %}{% endblock %} - My Webpage</title>
    {% endblock %}
</head>
<body>
    <div id="content">{% block content %}{% endblock %}</div>
    <div id="footer">
        {% block footer %}
        &copy; Copyright 2008 by <a href="http://domain.invalid/">you</a>.
        {% endblock %}
    </div>
</body>
</html>
```

`views/somepage.html`

```html
{% extends "layout.html" %}
{% block title %}Index{% endblock %}
{% block head %}
    {{ super() }}
    <style type="text/css">
        .important { color: #336699; }
    </style>
{% endblock %}
{% block content %}
    <h1>Index</h1>
    <p class="important">
      Welcome to my awesome homepage.
    </p>
{% endblock %}
```

## Processing input

### Input data from the client

- URI parameters
- query part of the URI (GET parameters)
- HTTP message body

### URI parameters

`req.params.parameterName`

```js
// GET /user/adam
app.get('/user/:name', function (req, res) {
    var name = req.params.name; // => adam
    //...
});
```

An example URI parameters middleware would look like this:

```js
//Parameter middleware
router.param('name', function (req, res, next, name, paramName) {
    console.log('paramName' + ': ' + name);
    next();
})

app.get('/user/:name', function (req, res) {
    var name = req.params.name; 
    //...
});
```

### GET parameters

`req.query.parameterName`

```js
// GET /users?id=42&ref=45428174v24t2
app.get('/users', function (req, res) {
    console.log(req.query);
    var id = req.query.id;
    var ref = req.query.ref;
})
```

### POST parameters

`req.body.parameterName`

```js
// use the built-in body parser middleware
app.use(express.urlencoded());

// POST /users
app.post('/users', function(req, res) {
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    //...
});
```

## Form processing

POST-REDIRECT-GET method

1. Displaying the form with GET method
2. Sending data with POST method
3. In case of success redirection to success page
4. GET success page


If there are errors:

1. Displaying the form with GET method
2. Sending data with POST method
3. In case of error show the form again with error messages and prefilled values
4. Sending data with POST method
5. In case of success redirection to success page
6. GET success page


### Validating sent values

[`express-validator`](https://github.com/ctavan/express-validator) module

```js
var expressValidator = require('express-validator');

app.use(express.bodyParser());
app.use(expressValidator());

app.post('/', function(req, res) {

    req.checkBody('age', 'Invalid age').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        //error handling
    } else {
        //success branch
    }
});
```

## Session handling

### Setting up

Installation ([`express-session`](https://github.com/expressjs/session))

```
npm install express-session --save
```

Usage

```js
var session = require('express-session');

app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'secret code',
    resave: false,
    saveUninitialized: false,
}));

app.get('/', function (req, res) {
    // Read
    req.session.parameter
    // Write
    req.session.parameter = value;
});
```

### Counter example

```js
app.get('/', function (req, res) {
    var sess = req.session;
    var cnt = 0;

    if (sess.cnt) {
        cnt = sess.cnt;
    }
    cnt++;
    sess.cnt = cnt;

    res.render('counter', {
        cnt: cnt
    });
});
```

### Flash data

- Data living in the session only for one request long.
- Typically for passing messages.
- `connect-flash` module

```
npm install connect-flash --save
```

```js
var flash = require('connect-flash');

app.use(flash());

app.get('/', function (req, res) {
    // Read
    req.flash(type);
    // Write
    req.flash(type, msg);
});
```

## Persisting state to files

### Native file operations

[`fs` modul](https://nodejs.org/api/fs.html)

- Asynchronous
    + `fs.readFile()`
    + `fs.writeFile()`
- Synchronous
    + `fs.readFileSync()`
    + `fs.writeFileSync()`

### NeDB

[Github page of the project](https://github.com/louischatriot/nedb)

`npm install --save nedb`

## Authentication

### Passport.js

- [Documentation](http://passportjs.org/)
- Very simple interface
- Authentication strategies
    + local
    + Facebook
    + Google
    + Twitter
    + Github
    + etc

### Installing and importing

```
npm install passport --save
```

```js
var passport = require('passport');
```

### Setting up a strategy

Installing

```
npm install passport-<strategy> --save
```

Using

```js
var Strategy = require('passport-<strategy>');

passport.use([name, ] new Strategy([options, ]
    function(username, password, done) {
        // Validating username and password

        // Returning the result
        return done(err); //Error
        return done(null, false, { message: 'Üzenet' }); //Authentication failed
        return done(null, user); //Successful authentication, giving back the uesr object
    }
));
```

### Registering middlewares

```js
//Passport middlewares
app.use(passport.initialize());

//Using sessions (optional)
app.use(passport.session());
```

### Passport and the session

Deciding what to store in the session

```js
// Serialization to the session
passport.serializeUser(function(user, done) {
    done(null, <data stored in the session>);
});

// Recovery from the session
passport.deserializeUser(function(obj, done) {
    done(null, <the expected user object>);
});
```

### Using the authentication

`passport.authenticate()` method on endpoints

```js
// Redirection with parameters
app.post('/signup', passport.authenticate(<strategy>, {
    successRedirect:    '/login',
    failureRedirect:    '/login/signup',
    failureFlash:       true, // req.flash() method is needed!
    failureMessage:     "Bad credentials", // optional default message
    badRequestMessage:  'Missing credentials', // missing authentication data message
}));

// With callback function
app.post('/login', passport.authenticate(<strategy>),
    function(req, res) {
        // To be called on successful authentication
        // `req.user` is the authenticated user
        res.redirect('/users/' + req.user.username);
    });
```

### Logging out

`req.logout()`

### Authorization

Access management

What kind of resources an authenticated user can access?

Multiple level:

- application
- endpoint
- part of the page
- input field

Grouping users: roles

### Solutions

Typically on endpoint middlewares.

- Passport
    + `req.isAuthenticated()` 
- Module
    + `connect-ensure-login` module
- High-level
    + `acl` module

### Login form example

The form

`GET /login`

```html
<!doctype html><title>Login</title>
<form action="/login" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>
```

### Login form example

Server side logic: using in-memory credentials

```js
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var credentials = {
    'user1': 'user1',
    'a': 'a',
    'user3': 'user3',
};

passport.use('local', new LocalStrategy(
    function(username, password, done) {
        // console.log(username, password);
        if (!credentials[username]) {
         return done(null, false, { message: 'Incorrect username.' });
        }
        if (credentials[username] !== password) {
         return done(null, false, { message: 'Incorrect password.' });
        }
        var user = {
         id: username,
         username: username
        };
        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
   done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
   var user = credentials[id];
   done(null, user);
});

// route middleware to make sure
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
        
app.use(passport.initialize());
app.use(passport.session());

app.get('/vedett', isLoggedIn, function (req, res) {
    res.render('vedett');
});

app.get('/login', function (req, res) {
    res.render('login');
})

app.post('/login', 
    passport.authenticate('local', { successRedirect: '/vedett',
                                   failureRedirect: '/login' })
);
```

### Login form example

Server side logic: using file

```js
var Datastore = require('nedb'),
    db = new Datastore({ filename: 'credentials.nedb', autoload: true });

passport.use('local', new LocalStrategy(
    function(username, password, done) {
        db.find({username: username}, function (err, docs) {
            if (docs.length === 0) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            var user = docs[0];
            if (user.password !== password) {
                console.log(1);
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        });
   }
));

passport.serializeUser(function(user, done) {
   done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
   db.findOne({_id: id}, function (err, user) {
        done(null, user);
   });
});

//Registering two default users
app.get('/fill', function (req,res) {
    db.insert({
        username: 'a',
        password: 'a'
    });
    db.insert({
        username: 'b',
        password: 'b'
    });
    res.end();
})
```


### Tasks

1. 

### Monday group

- 

### Tuesday group

- 

