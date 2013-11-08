var Q = require('q');
var _ = require('underscore');


var compressUserAgentByPlatformAndBrowser = function(userAgents) {
    var families = [];
    var summarizeFamilyVersion = _.memoize(function (member) {
        member.amount = 0;
        families.push(member);
        return member;
    }, function (member) {
        return member.identifyer;
    }); 

    var createIdentifyerString = function(userAgent) {
        var identifyer = [
            userAgent.os,
            userAgent.family,
            userAgent.major
        ];
        return identifyer.join(" ");
    }

    userAgents.forEach(function(userAgent) {
        var amount = userAgent.amount;
          
        userAgent.identifyer = createIdentifyerString(userAgent.userAgent);
        var family = summarizeFamilyVersion(userAgent);
        family.amount += amount;
    });

    return families;
};

var JenkinsService = function(jenkinsRepository) {
    this.repository = jenkinsRepository;
};

JenkinsService.prototype = {
    browsers: function() {

        var deferred = Q.defer();
        var browsers = this.repository.browsers();

        browsers.then(function(userAgents) {
            var compressed = compressUserAgentByPlatformAndBrowser(userAgents);
            deferred.resolve(compressed);
        });

        browsers.fail(deferred.reject);

        return deferred.promise;
    },
  
    pollJobs: function(interval, jobsChangedCallback) {
        var service = this;
        var lastChangedBrowsers = [];

        var doneCallback = function(browsers) {
            var browsersAreUnchanged = _.isEqual(browsers, lastChangedBrowsers);

            if (!browsersAreUnchanged) {
                lastChangedBrowsers = browsers;
                jobsChangedCallback(lastChangedBrowsers);
            }
        };

        setInterval(function() {
            service.repository.browsers().then(doneCallback).fail(function(error) {
                console.log(error);
            });
        }, interval);
    }
};

module.exports = JenkinsService;