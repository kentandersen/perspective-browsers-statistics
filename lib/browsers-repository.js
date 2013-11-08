var fs = require("fs");
var request = require('request');
var logger = require('./browsers-logger');
var Q = require('q');
var byline = require('byline');
var userAgent = require("useragent");


var BrowsersRepository = function(config) {
    this.config = config;
};

BrowsersRepository.prototype = {
    browsers: function() {
        var deferred = Q.defer();

        this._getAccessLog(deferred.resolve, deferred.reject);

        return deferred.promise;
    },

    _getAccessLog: function(successCallback, errorCallback, options) {
        var fileStream = fs.createReadStream(this.config.accessLogFile, {encoding: "utf8"});
        fileStream = byline(fileStream);

        var parsedData = [];
        var that = this;
        fileStream.on("data", function(line) {
            var data = that._parseLine(line);
            if(data) {
              parsedData.push(data);
            }
        });

        fileStream.on("end", function() {
            successCallback(parsedData);
        });
        
        fileStream.on("error", errorCallback);
    }, 

    _parseLine: function(line) {
        if(typeof line !== "string") {
            return false;
        }

        line = line.trim();
        
        if(!line) {
            return false
        }

        // get amount
        var splitpoint = line.indexOf(" ");
        var amount = line.substr(0, splitpoint);

        // get agent string
        var userAgentString = line.substr(splitpoint+1);

        return {
            amount: parseInt(amount, 10),
            userAgent: userAgent.parse(userAgentString)
        };
    }
};



module.exports = BrowsersRepository;