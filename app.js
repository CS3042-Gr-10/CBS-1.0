const path = require('path')

//config settings that need to be in .env
global.appRoot = path.resolve(__dirname);
global.SECRET = "SeychellesBank"
global.PORT = 9890;
global.IN_PROD = false;
global.SESS_NAME = 'Seychellesbank_sess';

const apis = require("./config/api-config");



apis.app.listen(process.env.PORT || PORT, function() {
    console.log("server connected to port " + PORT);
});
