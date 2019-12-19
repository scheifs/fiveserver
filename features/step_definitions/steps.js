const { setDefaultTimeout, Given, When, Then, AfterAll, After } = require("cucumber");
const expect = require('expect');
const UserService = require('../../service/user_service');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const DBDAO = require('../../dao/db-dao');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbdao = new DBDAO(client);
const userService = new UserService(dbdao);

const endpoint = 'http://localhost:8080';

let httpStatus;

async function deleteTestUser() {
    await userService.deleteUsers({
        email: 'test@test.com'
    });
}

async function addTestUser() {
    return await axios.post(`${endpoint}/api/users`, {
        email: 'test@test.com',
        password: 'abc123'
    });
}

Given('the API is available', function () {
    // Write code here that turns the phrase above into concrete actions
    // return 'pending';
});

When('the client request to get a json web token', async () => {

    await deleteTestUser();
    await addTestUser();
    const tokenResponse = await axios.post(`${endpoint}/api/token`, {
        email: 'test@test.com',
        password: 'abc123'
    });
    httpStatus = tokenResponse.status;
    expect(tokenResponse.data.token).toBeDefined();
});

When('the client request to add a nonexisting user via POST \\/api\\/users', async () => {
    await deleteTestUser();
    const addUserResponse = await addTestUser();

    expect(addUserResponse.data.email).toBe('test@test.com');
    expect(addUserResponse.data.nickname).toBe('test');
    expect(addUserResponse.data.passwordHash).toBeDefined();
    expect(addUserResponse.data.salt).toBeDefined();
    expect(addUserResponse.data._id).toBeDefined();
    httpStatus = addUserResponse.status;
});

When('the client request to add an existing user via POST \\/api\\/users', async () => {

    await deleteTestUser();
    await addTestUser();

    try {
        await addTestUser();
    } catch (err) {
        httpStatus = err.response.status;
    }

});

Then('the response should be HTTP {string}', function (status) {
    expect(httpStatus).toBe(Number(status));
});

After(async () => {
    httpStatus = null;
});

AfterAll(async () => {
    await client.close();
    await dbdao.disconnect();
});