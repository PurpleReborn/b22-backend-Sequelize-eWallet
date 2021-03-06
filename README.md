<h1 align="center">ExpressJS - #Nama_Projek RESTfull API</h1>

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #nama_database, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:8080/)
8. You can see all the end point [here](https://www.getpostman.com/collections/e5d8e63879241482847a)
9. For mySql [here](https://drive.google.com/file/d/18V_61LOT8wzTE1ayHLO2zV0WIbm1UaAr/view)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
APP_URL=http://localhost:8080
APP_PORT=8080
APP_KEY=b4ck3nd

APP_UPLOAD_ROUTE=/uploads
APP_UPLOAD_PATH=assets/images

DB_HOST=localhost
DB_NAME=ovo_backend
DB_USER=root
DB_PASS=
```

## License

© [Sandi Muhamad Rizalul](https://github.com/PurpleReborn/)
