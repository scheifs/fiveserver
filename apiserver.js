const restify = require('restify');
const userApi = require('./api/user_api');
const gameApi = require('./api/game_api');
const MongoClient = require('mongodb').MongoClient;
const DBDAO = require('./dao/db-dao');
const UserService = require('./service/user_service');
const GameService = require('./service/game_service');
const authApi = require('./api/auth_api');

const url = process.env.mongourl || 'mongodb://localhost:27017';
const database = process.env.database || 'fiveatdd';

const client = new MongoClient(url, { useUnifiedTopology: true });
const dbdao = new DBDAO(client);
const userService = new UserService(dbdao, database, 'users');
const gameService = new GameService(dbdao, database, 'games');

const server = restify.createServer();

server.pre(restify.plugins.pre.sanitizePath()); // Cleans up sloppy URLs on the request object, like /foo////bar/// to /foo/bar.

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use((req,res,next) => authApi.authorizeApiRequest(req, res, next));

server.get('/api/health', (req, res) => {
  res.send(200);
});

server.post('/api/token', (req, res, next) => authApi.getToken(req, res, next, userService));

// /users
server.post('/api/users', (req, res, next) => userApi.addUser(req, res, next, userService));
server.del('/api/users', (req, res, next) => userApi.deleteUsers(req, res, next, userService));

// /users/:userid
server.get('/api/users/:userid', (req, res, next) => userApi.getUser(req, res, next, userService));
server.patch('/api/users/:userid', (req, res, next) => userApi.updateUser(req,res,next,userService));


server.post('/api/users/:userid/games', (req, res, next) => userApi.addGame(req, res, next, userService));
server.post('/api/users/:userid/games/:gameid/move', (req, res, next) => gameApi.move(req, res, next, gameService));
server.get('/api/games/:gameid', (req, res, next) => gameApi.getGameById(req,res,next,gameService));
server.post('/api/games', (req, res, next) => gameApi.addGame(req,res,next,gameService));

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});