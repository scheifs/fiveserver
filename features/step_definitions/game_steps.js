const { setDefaultTimeout, Given, When, Then, AfterAll, After } = require("@cucumber/cucumber");
const expect = require('expect');
const UserService = require('../../service/user_service');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const DBDAO = require('../../dao/db-dao');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbdao = new DBDAO(client);
const userService = new UserService(dbdao, 'fiveatdd', 'users');

const endpoint = 'http://localhost:8080';
let httpStatus;

let user1;
let user2;
let game;

async function createNewUser(email, password) {

    await userService.deleteUsers({
        email: email
    });
    const newUser = await axios.post(`${endpoint}/api/users`, {
        email: email,
        password: password
    });
    const token1 = await axios.post(`${endpoint}/api/token`, {
        id: newUser.data._id,
        password: password
    });
    return {
        token: token1.data.token,
        id: newUser.data._id,
        email,
        password
    };

}

Given('the game API is available AND there are two users', async () => {

    if (!user1) {
        user1 = await createNewUser('user1@test.com', 'abc123');
    }
    if (!user2) {
        user2 = await createNewUser('user2@test.com', 'abc123');
    }

});


When('the client request a new game', async () => {

    const gamePost = {
        players: [
            { userid: user1.id, color: "orange" },
            { userid: user2.id, color: "blue" }
        ]
    };

    const gameResponse = await axios.post(`${endpoint}/api/games`, gamePost, {
        headers: {
            "X-Auth-Token": user1.token
        }
    });

    game = gameResponse.data;
    httpStatus = gameResponse.status;

});

When('the player request a new card with a full hand', async function () {

    const movePayload = {
        move: 'Draw'
    };

    try {
        await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload, {
            headers: {
                "X-Auth-Token": user1.token
            }
        });
    } catch (err) {
        httpStatus = err.response.status;
    }


});


Then('the game response should be HTTP {string}', function (status) {
    expect(httpStatus).toBe(Number(status));
});

AfterAll(async () => {
    // userService.deleteUsers({});
    await client.close();
    await dbdao.disconnect();
});