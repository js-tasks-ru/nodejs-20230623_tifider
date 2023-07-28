const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let message;

router.get('/subscribe',
    async (ctx, next) => {
      await new Promise((resolve) => {
        app.on('message_published', () => resolve());
      });

      next();
    },
    (ctx) => {
      ctx.body = message;
    });

router.post('/publish', async (ctx) => {
  if (!ctx.request.body.message) {
    ctx.status = 400;
    ctx.message = 'Empty message body, expected string.';
  } else {
    message = ctx.request.body.message;
    app.emit('message_published');
    ctx.status = 204;
  }
});

app.use(router.routes());

module.exports = app;
