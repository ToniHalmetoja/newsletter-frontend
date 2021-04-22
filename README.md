# newsletter-frontend

A school project. Effectively, just a demonstration of a login/subscription system that relies on a separately hosted mongodb database (on atlas), a backend (on heroku) and a frontend, hosted right here.

If you don't know what this is, though, I doubt you'll find anything of interest here!

Guide:

Install all dependencies. Express, random-keys, cors, cryptoJS, and mongodb.

Change fetchURL in script.js to whatever URL you want to use.

The salt key for password encryption is stored as an environmment variable on Heroku. You'll need to change this to run this on something else. Create an .env and set SALT_KEY.

Admin interface will be at [url]/admin

Example user: janne@janne.com, password: test

---

Otherwise, there is a functional demo at https://tonihalmetoja.github.io/newsletter-frontend/.



