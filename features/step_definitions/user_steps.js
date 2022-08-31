const { Given, When, Then, AfterAll, After } = require("@cucumber/cucumber");
const assert = require('assert');
const UserService = require('../../service/user_service');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const DBDAO = require('../../dao/db-dao');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });
const dbdao = new DBDAO(client);
const userService = new UserService(dbdao,'fiveatdd','users');

const endpoint = 'http://localhost:8080';

let httpStatus;

async function deleteTestUser() {
    await userService.deleteUsers({
        email: 'test@test.com'
    });
}

async function addTestUser(payload = {
    email: 'test@test.com',
    password: 'abc123'
}) {
    return await axios.post(`${endpoint}/api/users`, payload);
}

async function getTestUser(id, token) {
    const testUser = await axios.get(`${endpoint}/api/users/${id}`, {
        headers: {
            "X-Auth-Token": token
        }
    });
    return testUser;
}

async function getTestToken(id) {
    const tokenResponse = await axios.post(`${endpoint}/api/token`, {
        id,
        password: 'abc123'
    });
    return tokenResponse.data.token;
}

async function patchUser(id, token, patchPayload) {
    const patchedUser = await axios.patch(`${endpoint}/api/users/${id}`, patchPayload, {
        headers: {
            "X-Auth-Token": token
        }
    });
    return patchedUser;
}

Given('the API is available', function () {

});

When('the client request to get a json web token', async () => {

    await deleteTestUser();
    const newUser = await addTestUser();
    const tokenResponse = await axios.post(`${endpoint}/api/token`, {
        id: newUser.data._id,
        password: 'abc123'
    });
    httpStatus = tokenResponse.status;

    assert.notEqual(tokenResponse.data.token, null);
    
});

When('the client request to add a nonexisting user via POST \\/api\\/users', async () => {
    await deleteTestUser();
    const addUserResponse = await addTestUser();

    assert.equal(addUserResponse.data.email, 'test@test.com');
    assert.equal(addUserResponse.data.nickname, 'test');

    assert.notEqual(addUserResponse.data.passwordHash, undefined);
    assert.notEqual(addUserResponse.data.salt, undefined);
    assert.notEqual(addUserResponse.data._id, undefined);
    
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

When('the client request to get an existing user via GET \\/api\\/users\\/:userid', async () => {

    await deleteTestUser();
    const testUser = await addTestUser();
    const token = await getTestToken(testUser.data._id);
    try {
        const getUserResponse = await getTestUser(testUser.data._id, token);
        httpStatus = getUserResponse.status;
        assert.equal(getUserResponse.data.email, 'test@test.com')
    } catch (err) {
        httpStatus = err.response.status;
    }

});

When('the client request to get an existing user with no token to GET \\/api\\/users\\/:userid', async () => {

    await deleteTestUser();
    const testUser = await addTestUser();
    try {
        await getTestUser(testUser.data._id, null);
    } catch (err) {
        httpStatus = err.response.status;
    }

});

When('the client request to update an existing user via PATCH \\/api\\/users\\/:userid', async () => {

    await deleteTestUser();
    const testUser = await addTestUser();

    assert.equal(testUser.data.email,'test@test.com');
    const token = await getTestToken(testUser.data._id);
    try {
        const patchedUser = await patchUser(testUser.data._id, token, {
            email: 'test2@test.com'
        });
        assert.equal(patchedUser.data.email,'test2@test.com');
        httpStatus = patchedUser.status;
    } catch (err) {
        console.log(err);
        httpStatus = err.response.status;
    }

});

When('the client request to update an existing user passwordHash\\/salt via PATCH \\/api\\/users\\/:userid', async () => {

    await deleteTestUser();
    const testUser = await addTestUser();

    const token = await getTestToken(testUser.data._id);
    try {
        const patchedUser = await patchUser(testUser.data._id, token, {
            passwordHash: `newhash`,
            salt: `pepper`
        });
        assert.equal(patchedUser.data.email, 'test2@test.com');
        httpStatus = patchedUser.status;
    } catch (err) {
        httpStatus = err.response.status;
    }

});

Then('the response should be HTTP {string}', function (status) {
    assert.equal(Number(httpStatus), Number(status));
});

After(async () => {
    httpStatus = null;
});

AfterAll(async () => {
    // userService.deleteUsers({});
    await client.close();
    await dbdao.disconnect();
});