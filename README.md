This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport](http://passportjs.org/) to authenticate users using Google.  Use
this example as a starting point for your own web applications.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone https://github.com/travishorn/passport-google-example.git
$ cd passport-google-example
$ npm install
```

The example uses environment variables to configure the client ID and client secret needed to access Google's API. You need to obtain those first on the [Google Developer Console](https://console.developers.google.com/)

Copy `.env.example` to `.env` and set your own variables before starting the server.

```
npm run start
```

Open a web browser and navigate to [http://localhost:3000/](http://localhost:3000/)
to see the example in action.
