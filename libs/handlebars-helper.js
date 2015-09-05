var Handlebars = require('handlebars');

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});
