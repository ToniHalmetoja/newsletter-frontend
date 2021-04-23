# Newsletter Getter!

A school project. Effectively, just a demonstration of a login/subscription system that relies on a separately hosted mongodb database (on atlas), a backend (on heroku) and a frontend, hosted right here.

If you don't know what this is, though, I doubt you'll find anything of interest here!

Functional demo at https://tonihalmetoja.github.io/newsletter-frontend/.

Example user: janne@janne.com, password: test

# Guide for installing and running this elsewhere:

Download both the frontend and backend code, and host them where desired.

# Frontend:

Change the fetchURL variable in the frontend's script.js to whatever URL your backend is hosted on.

# Backend:

The backend can be found here: https://github.com/ToniHalmetoja/newsletter-backend/

1) Install Node (and NPM). 

2) Further, install all NPM dependencies: express, random-keys, cors, cryptoJS, and mongodb. npm-install should cover it.

3) The salt key for password encryption (used in users.js and admin.js) is stored as an environment variable on Heroku. You'll need to change this to run this on something else. Create an .env and set SALT_KEY.

4) Similarly, the API key for database access (in this case, for MongoDB Atlas) is stored as API_KEY, as an environmental variable. Alternatively, change the entire connect URL (in app.js) to wherever your database is stored.

5) After you're done with this, start the backend with npm start, nodemon, or really, whatever you'd like.

Admin interface will be at http://backEndURL/admin


