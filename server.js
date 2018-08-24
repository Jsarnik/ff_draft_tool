var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');
var mongoConfig = require('./mongo/MongoConfig');
var routes = require('./api/routes');
var cors = require('cors');
var Logger = require('./Logger');
var app = express();

mongoConfig.MongoConfiguration.Initialize();
var mongoDb = mongoConfig.MongoConfiguration.MongoDb();
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

app.use(express.static(__dirname + '/app'));

app.get('/', (req, res) =>{
    res.sendfile('app/public/index.html');
});

routes.configure(app);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

var httpServer = http.createServer(app);

var httpPort = process.env.PORT || 3001;

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
    }
}); 

