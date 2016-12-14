var context = require.context('./static', true, /.+\.spec\.js?$/);
context.keys().forEach(context);
module.exports = context;