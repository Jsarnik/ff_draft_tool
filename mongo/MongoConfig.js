
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var db;

class MongoConfiguration{
    Initialize(){
        var dbName = 'fantasy_tool';
        var mongoDBConnectionString;

        if (1==1) {
            mongoDBConnectionString = 'mongodb://127.0.0.1/' + dbName;
        }else{
            mongoDBConnectionString = 'mongodb://' + config.instanceName + '/' + dbName;
        }

        mongoose.connect(mongoDBConnectionString, {
            useMongoClient: true
        });
        // Get Mongoose to use the global promise library
        mongoose.Promise = global.Promise;

        //Get the default connection
        db = mongoose.connection; 
    }

    MongoDb(){
        return db;
    }
}
exports.MongoConfiguration = new MongoConfiguration();