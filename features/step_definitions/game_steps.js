const { setDefaultTimeout, Given, When, Then, AfterAll, After } = require("@cucumber/cucumber");
const axios = require('axios');

const endpoint = 'http://localhost:8080';
let httpStatus;


When('the client request a new game', async () => {

    const gamePost = {
        players: [
            { userid: 1, color: "orange" },
            { userid: 2, color: "blue" }
        ]
    };

    const gameResponse = await axios.post(`${endpoint}/api/games`, gamePost);
    httpStatus = gameResponse.status;

});


Then('the response should be HTTP {string}', function (status) {
    expect(httpStatus).toBe(Number(status));
});
