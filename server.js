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
const axios = require('axios');

mongoConfig.MongoConfiguration.Initialize();
let mongoDb = mongoConfig.MongoConfiguration.MongoDb();
mongoDb.on('error', (err)=>{
    console.log('mongodb connection err' + err.toString())
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

app.use(express.static(path.join(__dirname,'/app/build')));
routes.configure(app);
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'build', 'index.html'));
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

        // const options = {
        //     headers:{
        //         'Access-Control-Request-Method': 'POST',
        //         'Access-Control-Request-Headers': 'cache-control,content-type,conversation-id,correlation-id,expires,pragma',
        //         'Origin': 'https://cdn.registerdisney.go.com'
        //     }
        // }

        // let apiKey = null,
        // correlation_id = null,
        // conversation_id =null;

        // axios.options('https://registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/api-key?langPref=en-US', options)
        //     .then(res => {
        //         correlation_id = res.headers['correlation-id'];
        //         conversation_id = uuid();
        //         axios.post('https://registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/api-key?langPref=en-US', {
        //             body: 'null',
        //             headers: {
        //                 'Referer': 'https://registerdisney.go.com/v2/ESPN-ONESITE.WEB-PROD/en-US?include=config,l10n,js,html&scheme=http&postMessageOrigin=http%3A%2F%2Fwww.espn.com%2Flogin%2F&cookieDomain=www.espn.com&config=PROD&logLevel=LOG&topHost=www.espn.com&cssOverride=https%3A%2F%2Fsecure.espncdn.com%2Fcombiner%2Fc%3Fcss%3Ddisneyid%2Fcore.css&responderPage=https%3A%2F%2Fwww.espn.com%2Flogin%2Fresponder%2F&buildId=16388ed5943',
        //                 'Content-Type': 'application/json',
        //                 'conversation-id': conversation_id,
        //                 'correlation-id': correlation_id
        //             }
        //         })
        //         .then(res2 => {
        //             apiKey = res2.headers['api-key'];
        //             axios.options('https://ha.registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/guest/login?langPref=en-US HTTP/1.1', {
        //                 headers: {
        //                     'Access-Control-Request-Method': 'POST', 
        //                     'Access-Control-Request-Headers': 'authorization,cache-control,content-type,conversation-id,correlation-id,expires,pragma',
        //                     'Origin': 'https://cdn.registerdisney.go.com'
        //                 }
        //             })
        //             .then(res3 => {     
        //                 axios.post('https://ha.registerdisney.go.com/jgc/v6/client/ESPN-ONESITE.WEB-PROD/guest/login?langPref=en-US', {
        //                     headers:{
        //                         'Referer': 'https://cdn.registerdisney.go.com/v2/ESPN-ONESITE.WEB-PROD/en-US?include=config,l10n,js,html&scheme=http&postMessageOrigin=http%3A%2F%2Fwww.espn.com%2Flogin%2F&cookieDomain=www.espn.com&config=PROD&logLevel=LOG&topHost=www.espn.com&cssOverride=https%3A%2F%2Fsecure.espncdn.com%2Fcombiner%2Fc%3Fcss%3Ddisneyid%2Fcore.css&responderPage=https%3A%2F%2Fwww.espn.com%2Flogin%2Fresponder%2F&buildId=16388ed5943',
        //                         'Content-Type': 'application/json',
        //                         'Authorization': `APIKEY ${apiKey}`,
        //                         'correlation-id': correlation_id,
        //                         'conversation-id': conversation_id,
        //                         'Origin': 'https://cdn.registerdisney.go.com'
        //                     },
        //                     body: JSON.stringify({"loginValue":"","password":""})
        //                 })
        //                 .then(res4 => {
        //                     console.log(res4);
        //                 })
        //                 .catch(e4 => {
        //                     let err = e4.response.data.error.errors[0];
        //                     console.log(err);
        //                 })
        //             })
        //             .catch(e3 => {
        //                 console.log(e3);
        //             })
        //         })
        //         .catch(e2 => {
        //             console.log(e2);
        //         });
        //     }).catch(e => {
        //         console.log(e)
        //     });

        //     function f() { return g() + g() + "-" + g() + "-" + g("4") + "-" + g((Math.floor(10 * Math.random()) % 4 + 8).toString(16)) + "-" + g() + g() + g() }

        //     function g(e) { for (var t = Math.floor(65535 * Math.random()).toString(16), n = 4 - t.length; n > 0; n--) t = "0" + t; return e = ("" + e).substring(0, 4), !isNaN(parseInt(e, 16)) && e.length ? e + t.substr(e.length) : t }

        //     function uuid(){return f();}

    }
}); 

