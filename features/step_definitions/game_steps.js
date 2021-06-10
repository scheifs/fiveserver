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
const gameService = require('../../service/game_service');

const endpoint = 'http://localhost:8080';
let httpStatus;

let user1;
let user2;
let game;
let gameResponse;

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

When('a new game has begun', async () => {

    const gamePost = {
        players: [
            { userid: user1.id, color: "orange" },
            { userid: user2.id, color: "blue" }
        ]
    };

    gameResponse = await axios.post(`${endpoint}/api/games`, gamePost, {
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
        gameResponse = await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload, {
            headers: {
                "X-Auth-Token": user1.token
            }
        });
    } catch (err) {
        httpStatus = err.response.status;
    }

});

When('the player plays a high card into an empty lower space', async function () {

    const player = gameService.findPlayerWithPlayerId(game, game.playersTurnId);
    const sortedCards = player.cards.sort();
    console.log(sortedCards);

    const movePayload = {
        move: 'Play',
        card: sortedCards[3],
        boardNumber: 0
    }

    try {
        gameResponse = await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload, {
            headers: {
                "X-Auth-Token": user1.token
            }
        });
    } catch (err) {
        httpStatus = err.response.status;
    }

});

When('the player plays a card they dont hold', async function () {

    const movePayload = {
        move: 'Play',
        card: -1,
        boardNumber: 0
    }

    try {
        gameResponse = await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload, {
            headers: {
                "X-Auth-Token": user1.token
            }
        });
    } catch (err) {
        httpStatus = err.response.status;
    }

});

When('player one plays a valid move', async function () {

    console.log(`===== PLAYER 1 MOVE ======== ${game.playersTurnId}`);
    console.log(JSON.stringify(game.moves));

    const player = gameService.findPlayerWithPlayerId(game, game.playersTurnId);
    const sortedCards = player.cards.sort();

    const movePayload = {
        move: 'Play',
        card: sortedCards[3],
        boardNumber: sortedCards[3]
    }

    console.log(movePayload);
    gameResponse = await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload, {
        headers: {
            "X-Auth-Token": user1.token
        }
    });
    game = gameResponse.data;
    console.log(`Player 1 http status ${gameResponse.status}`);
    httpStatus = gameResponse.status;

    console.log("===== PLAYER 1 MOVE DONE ========")

});

When('player two plays a valid move', async function () {

    console.log(`===== PLAYER 2 MOVE ======== ${game.playersTurnId}`);
    console.log(JSON.stringify(game.moves));

    const player = gameService.findPlayerWithPlayerId(game, game.playersTurnId);
    const sortedCards = player.cards.sort();

    const movePayload = {
        move: 'Play',
        card: sortedCards[3],
        boardNumber: sortedCards[3]
    };

    console.log(movePayload);

    gameResponse = await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload, {
        headers: {
            "X-Auth-Token": user2.token
        }
    });
    game = gameResponse.data;
    console.log(`Player 2 http status ${gameResponse.status}`);
    httpStatus = gameResponse.status;

    console.log("===== PLAYER 2 MOVE DONE ========")

});

When('move played into occupied board number', async function () {

    const player = gameService.findPlayerWithPlayerId(game, game.playersTurnId);
    const sortedCards = player.cards.sort();

    const movePayload = {
        move: 'Play',
        card: sortedCards[3],
        boardNumber: sortedCards[3]
    }

    gameResponse = await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload, {
        headers: {
            "X-Auth-Token": user1.token
        }
    });

    game = gameResponse.data;

    const player2 = gameService.findPlayerWithPlayerId(game, game.playersTurnId);
    const sortedCards2 = player2.cards.sort();

    const movePayload2 = {
        move: 'Play',
        card: sortedCards2[3],
        boardNumber: sortedCards2[3]
    }

    try {
        gameResponse = await axios.post(`${endpoint}/api/games/${game._id}/move`, movePayload2, {
            headers: {
                "X-Auth-Token": user2.token
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