# CBS-1.0
implementation of the online banking system, use pr-SRS repo for all you testing scripts.

_follow up_
1. clone to preferable place the repo after it forked from this repo
2. Init npm \
`npm init --yes`
3. copy the following dictionay and paste it in the package.json file, as a attribute in main block. \
`"dependencies": {
    "ajv": "^5.5.0",
    "bcryptjs": "^2.4.3",
    "body-parser": "*",
    "cookie-parser": "~1.4.4",
    "cors": "*",
    "debug": "~2.6.9",
    "express": "*",
    "http-errors": "~1.6.3",
    "jsonwebtoken": "^8.1.0",
    "mysql": "^2.18.1",
    "node-schedule": "^1.3.0",
    "nodemailer": "^4.4.1",
    "nodemon": "^1.13.3",
    "pm2": "^2.9.1",
    "pug": "2.0.4"
  },`
  4. run following command to check weather you have connected to the GCI SQL.
  `node app.js`
