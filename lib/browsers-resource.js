var resourceErrorsFactory = require('perspective-core-rest').error.factory;

module.exports = function(webSocketServer, restServer, service) {

    var wsChannel = webSocketServer("browsers");

    var interval = 60*60*1000;
    service.pollJobs(interval, function(jobs) {
        wsChannel.send("browsers_changed", jobs);
    });

    restServer.route('get', '/browsers', function(req, res, next) {

    var respond = function(tasks) {
        res.send(200, tasks);
        next();
    };

    service.browsers()
        .then(respond)
        .fail(resourceErrorsFactory);

  });
};