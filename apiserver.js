const restify = require('restify');
const userApi = require('./api/user_api');
const MongoClient = require('mongodb').MongoClient;
const DBDAO = require('./dao/db-dao');
const UserService = require('./service/user_service');
const authApi = require('./api/auth_api');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbdao = new DBDAO(client);
const userService = new UserService(dbdao);

const server = restify.createServer();

server.pre(restify.plugins.pre.sanitizePath()); // Cleans up sloppy URLs on the request object, like /foo////bar/// to /foo/bar.

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use((req,res,next) => authApi.authorizeApiRequest(req, res, next));

server.post('/api/token', (req, res, next) => authApi.getToken(req, res, next, userService));

server.get('/api/user/:userid', (req, res, next) => userApi.getUser(req, res, next, userService));
server.post('/api/users', (req, res, next) => userApi.addUser(req, res, next, userService));
server.del('/api/users', (req, res, next) => userApi.deleteUsers(req, res, next, userService));
server.patch('/api/users/:userid', (req, res, next) => userApi.updateUser(req,res,next,userService));

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});