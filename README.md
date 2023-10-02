# Plaid Integration sandbox

This project is using the MERN starter template that I created. I am working with Plaid integration and Google Firestore, Authentication. I started by removing references to Mongodb, mongoose. The template uses a refresh/access token strategy for authentication, and since Firebase Authentication offers this out of the box client side, I decided to use the client side Firestore SDK.

Reading through the Plaid docs and getting familar with their /transactions/sync and /accounts/balance/get endpoints was a great learning experience. These endpoints open doors to countless opportunities for developing applications that offer valuable financial insights and services. Whether it's tracking expenses, analyzing spending patterns, or automating financial management, the possibilities are boundless.



### Table of Contents

---

1. [Development](#development)
2. [Server ENV Variables](#server-environment-variables)
3. [Client ENV Variables](#client-environment-variables)
4. [Starting up the App](#starting-up-the-app)
5. [Tech Stack](#tech-stack)
6. [Features](#features)
7. [Testing](#testing)
8. [Github workflow to contribute](#github-workflow-steps-to-contribute)

---

### Development

MERN-Starter requires [Node.js](https://nodejs.org/) v10+ to run. Tested on version `16.14.2`

This App uses [NPM](https://www.npmjs.com/) Node Package Manager to manage its dependencies and packages.

from the **Root** directory

```
$ npm install
```

This will install dependencies for the front end and backend simultaneously as I have configured [Workspaces] to define the `client` and `server` directories.

### Server environment variables

---

Create a .env file in the server folder and add your values.

For example:

```
 NODE_ENV=development
 PORT=3001
 API_URL=/api
 JWT_EXPIRES_IN=1h
 ACCESS_EXPIRES_IN=4d
 ACCESS_TOKEN_SECRET=your_secret
 REFRESH_EXPIRES_IN=10d
 REFRESH_TOKEN_SECRET=your_secret
 JWT_SECRET=your_secret
 APP_NAME=your_app_name
 PLAID_CLIENT_ID=
 PLAID_SECRET=
 PLAID_ENV=
```

### Client environment variables

---
```
  VITE_FIRE_API_KEY=""
  VITE_AUTH_DOMAIN=""
  VITE_PROJECT_ID=""
  VITE_STORAGE_BUCKET=""
  VITE_MESSAGING_SENDER_ID=""
  VITE_FIRE_APP_ID=""
  VITE_FIRE_MEASURE_ID=""
```

All Vite environment variables must start with `VITE_` unlike `Create-React-App`, which must start with `REACT_APP` I have set up a `constants.js` file in `client/src/client/config` that exports environment variables, for example `import.meta.env.VITE_BASE_API`. Notice how Vite used `import.meta.env` instead of `process.env`.

### Starting up the App

---

This App uses [concurrently] to start both the client and server. I have configured the root `package.json` to define workspaces with the client and server. So in the ROOT directory:

```
$ npm start
```

This will start your `client` on `http://localhost:5173/` and backend in development mode on `http://localhost:3001/`, with the server listening on `PORT` 3001.

## Features

- Login and Register
- Authentication using Firebase
- Rate Limiter to limit the rate an endpoint can be accessed.
- Custom Error handling
- Custom Logger to Log events and errors to your server

- More to be added as we develop

## Tech Stack

### **Front-end**
- [plaid-link] - React hook and components for integrating Plaid Link. Plaid Link is the client-side component that your users will interact with in order to link their accounts to Plaid and allow you to access their accounts via the Plaid API.

- [firebase] - Firebase provides the tools and infrastructure you need to develop, grow, and earn money from your app. This package supports web (browser), mobile-web, and server (Node.js) clients.

- [Vite] - A build tool that aims to provide a faster and leaner development experience for modern web projects.

- [React] - JavaScript frontend library.

- [Vitest] - Vitest is a testing library for Vite, a modern development build tool for JavaScript applications. It is designed to work seamlessly with Vite's fast and efficient development workflow, providing a convenient way to run tests in Vite projects.

### **Back-end**

---

- [plaid-node] - libraries and SDKs to easily integrate with the Plaid APIs.

- [firebase-admin] - Firebase provides the tools and infrastructure you need to develop your app, grow your user base, and earn money. The Firebase Admin Node.js SDK enables access to Firebase services from privileged environments (such as servers or cloud) in Node.js.

- [Node.js] - Cross-platform, open-source server environment that can run on Windows, Linux, Unix, macOS, and more. Node.js is a backend JavaScript runtime environment that runs on the V8 JavaScript Engine and executes JavaScript code outside a web browser.

- [Express] - Express.js, or simply Express, is a backend web application framework for building RESTful APIs with Node.js.



### **Testing**

---

Testing your application is very important to ensure it is running as expected and as a user would interact with it without breaking and encountering bugs. I have set up [Vitest] in the client, and there is a `__tests__` directory in the `src/client` directory. Simply running `npm test` from the client directory will run all the files with `.tests` in their extension. I have configured some starter tests that test that the `Register` and `Login` display inputs and simulate a user typing into an input that changes its value. Feel free to add your tests as your application grows.

Feel free to put your `.tests` closer to the components you are testing. They don't _have_ to all go in the `__tests__` directory.

I plan to add server-side testing as I build out this template.

### Github workflow steps to contribute

---

- Creator: Create a new issue

- Dev: Pick an issue

- Dev: Comment agreeing to work on the issue

- Dev: Assign issue to themself

- Dev: Make a branch, named with the issue number and description

- Dev: Make changes, commit changes

- Dev: Make a pull request (PR)

- Creator: Review PR

- Creator: Request changes

- Dev: Complete requested changes, commit and submit PR

- Creator: Approve changes, request merge

- Dev: Merge PR

- Dev: Delete issue-specific branch

- Creator: Close issue

---

**Find a bug?**

I welcome contributions. Simply fork the repository and open a pull request and I will review them.

[tailwind css]: https://tailwindcss.com/docs/guides/vite
[DaisyUI]: https://daisyui.com/
[vite]: https://vitejs.dev/
[mongoose]: https://mongoosejs.com/
[firebase-admin]: https://www.npmjs.com/package/firebase-admin
[Vitest]: https://vitest.dev/
[node.js]: http://nodejs.org
[nginx]: https://www.nginx.com/
[express]: http://expressjs.com
[react]: https://react.dev/
[concurrently]: https://www.npmjs.com/package/concurrently
[http://54.90.137.205/]: http://54.90.137.205/
[Workspaces]: https://docs.npmjs.com/cli/v8/using-npm/workspaces
[firebase]: https://npmjs.com/package/firebase
[plaid-link]: https://www.npmjs.com/package/react-plaid-link
[plaid-node]:https://github.com/plaid/plaid-node
