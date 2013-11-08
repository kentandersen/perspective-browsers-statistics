var BrowsersRepository = require('./browsers-repository');
var BrowsersService = require('./browsers-service');
var BrowsersResource = require('./browsers-resource');

var coreRest = require('perspective-core-rest');
var coreWebSocket = require('perspective-core-web-socket');

var produceBrowsersConfig = require('./config')

module.exports = function(env) {
    var repo = new BrowsersRepository(produceBrowsersConfig(env));
    var service = new BrowsersService(repo);

    var serverConfig = coreRest.produceConfig(env);
    var restServer = coreRest.createServer(serverConfig);
    var webSocketServer = coreWebSocket.createServer(restServer.server, serverConfig);

    new BrowsersResource(webSocketServer, restServer, service);
};


