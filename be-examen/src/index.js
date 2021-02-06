var koa = require('koa');
var app = module.exports = new koa();
const server = require('http').createServer(app.callback());
const WebSocket = require('ws');
const wss = new WebSocket.Server({server});
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

app.use(bodyParser());

app.use(cors());

app.use(middleware);

function middleware(ctx, next) {
  const start = new Date();
  return next().then(() => {
    const ms = new Date() - start;
    console.log(`${start.toLocaleTimeString()} ${ctx.request.method} ${ctx.request.url} ${ctx.response.status} - ${ms}ms`);
  });
}

app.use(async (ctx, next) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  await next();
});

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const quizes = [];
const names = ['p', 's1', 's2', 's3'];

for (let i = 0; i < 10; i++) {
  const randomInt = getRandomInt(1, 20);
  const question = [1, 2, 3].map(index => ({ id: randomInt + index, text: `${randomInt + index} + 1 = ?` }));
  let answer = question.map(q => ({ id: q.id, text: `${q.id % 2 === 0 ? q.id : q.id + 1}` }));
  answer = answer.map(a => ({ ...a, isCorrect: Number(a.text) === a.id + 1 }));
  const quiz = {
    id: i + 1,
    name: names[getRandomInt(1, names.length)],
    question,
    answer,
  }
  quizes.push(quiz);
}

const router = new Router();

router.post('/auth', ctx => {
  const { name } = ctx.request.body || {};
  if (typeof name !== 'undefined') {
    const index = names.findIndex(n => n === name);
    if (index === -1) {
      ctx.response.body = { text: 'Invalid user name!' };
      ctx.response.status = 400;
    } else {
      const role = index === 0 ? 'professor' : 'student';
      ctx.response.body = { role };
      ctx.response.status = 200;
    }
  } else {
    ctx.response.body = { text: 'Missing or invalid fields!' };
    ctx.response.status = 400;
  }
});

router.get('/quiz', ctx => {
  const { name } = ctx.query || {};
  ctx.response.body = name ? quizes.filter(it => it.name === name) : quizes;
  ctx.response.status = 200;
});

const broadcast = data => {
  const stringifiedData = JSON.stringify(data);
  console.log(`boadcast ${stringifiedData}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(stringifiedData);
    }
  });
};

router.post('/quiz', ctx => {
  const { name } = ctx.request.body || {};
  if (typeof name !== 'undefined') {
    const randomInt = getRandomInt(1, 20);
    const question = [1, 2, 3].map(index => ({ id: randomInt + index, text: `${randomInt + index} + 1 = ?` }));
    const quiz = {
      id: quizes.length + 1,
      name,
      question,
    }
    quizes.push(quiz);
    broadcast(quiz);
    ctx.response.body = quiz;
    ctx.response.status = 200;
  } else {
    ctx.response.body = {text: 'Missing or invalid fields!'};
    ctx.response.status = 400;
  }
});

router.patch('/quiz/:id', ctx => {
  const { id } = ctx.params || {};
  const { answer } = ctx.request.body || {};
  if (typeof id !== 'undefined' && typeof answer !== 'undefined' && Array.isArray(answer)) {
    const index = quizes.findIndex(it => it.id == id);
    if (index === -1) {
      ctx.response.body = { text: 'Invalid id' };
      ctx.response.status = 404;
    } else {
      Object.assign(quizes[index], { answer: answer.map(a => ({ ...a, isCorrect: Number(a.text) === a.id + 1 })) });
      ctx.response.body = quizes[index];
      ctx.response.status = 200;
      broadcast(quizes[index]);
    }
  } else {
    ctx.response.body = {text: 'Invalid id or answer'};
    ctx.response.status = 400;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

server.listen(3000);
