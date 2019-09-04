const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const mongoConfig = require('./mongo/MongoConfig');
const routes = require('./api/routes');
const cors = require('cors');
const Logger = require('./Logger');
const app = express();
const cleanupService = require('./CleanupService');

mongoConfig.MongoConfiguration.Initialize();
let mongoDb = mongoConfig.MongoConfiguration.MongoDb();
mongoDb.on('error', (err)=>{
    Logger.NodeLogger.log({
        level : 'error',
        message: 'Mongo Connection Error: ' + err.message.toString()
    });
});

app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(timeout(120000));
app.use(haltOnTimedout);
app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', `*`);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(path.join(__dirname,'./app/build')));
routes.configure(app);
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,'./app/build/index.html'));
});

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

let httpServer = http.createServer(app);
let httpPort = process.env.PORT || 3001;

httpServer.listen(httpPort, (err) =>{
    if(err){
        Logger.NodeLogger.log({
            level : 'error',
            message: "Node App Start Error: " + err.toString()
        });
    }else{
        Logger.NodeLogger.log({
            level : 'info',
            message: "Node App Started"
        });
        cleanupService.CleanupService.Initialize();
    }
}); 

