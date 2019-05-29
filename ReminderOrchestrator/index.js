const df = require('durable-functions');

module.exports = df.orchestrator(function*(context) {
  const template = yield context.df.callActivity('template', 'test');
  const email = yield context.df.callActivity('email', template);

  return email;
});
