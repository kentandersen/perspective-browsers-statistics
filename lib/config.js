var validation = require("perspective-core").validation;

module.exports = function(env) {

    var browsersConfig = {
        accessLogFile: env.USERAGENT_FILE
    };

    var browsersConfigValidationRules = {
        accessLogFile: {
            required: true
        }
    }

    var browsersValidationErrors = validation(browsersConfig, browsersConfigValidationRules);

    if (browsersValidationErrors) {
        console.error("Missing browsers config");
        console.error(browsersValidationErrors);
        process.exit(1);
    }

    return browsersConfig;
}