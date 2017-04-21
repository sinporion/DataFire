const datafire = require('../../lib');

const authorizer = new datafire.Action({
  handler: (input, context) => {
    const users = {
      user1: {name: "Number One", secret: "foobar"},
    }
    let user = users[context.request.headers.authorization];
    if (!user) return new datafire.Response({statusCode: 401});
    return user;
  }
})

module.exports = new datafire.Project({
  title: "SaaS #1",
  openapi: {
    host: 'localhost:3334',
    securityDefinitions: {
      api_key: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      }
    }
  },
  authorizers: {
    user: authorizer
  },
  paths: {
    '/me': {
      get: {
        action: new datafire.Action({
          handler: (input, ctx) => {
            return "You're logged in as " + ctx.accounts.user.name;
          }
        })
      }
    },
    '/secret': {
      get: {
        action: new datafire.Action({
          handler: (input, ctx) => {
            return ctx.accounts.user.secret;
          }
        })
      }
    }
  }
})