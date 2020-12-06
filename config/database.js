const mysql = require('mysql');
const fs = require('fs');


module.exports = mysql.createPool({
    host: '34.93.201.200',
    user: 'root',
    password: 'admin',
    ssl: {
        // cs: fs.readFileSync('./documents/ssl-keys-8/server-ca-1.pem')
        ca: fs.readFileSync('./documents/ssl-keys-8/server-ca.pem'),
        key: fs.readFileSync('./documents/ssl-keys-8/client-key.pem'),
        cert: fs.readFileSync('./documents/ssl-keys-8/client-cert.pem')
    }
})





