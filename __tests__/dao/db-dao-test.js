const DBDao = require('../../dao/db-dao')


describe('dbdao connect', () => {

  test('promise resolves when connection successful', async () => {

    const clientMock = {
      connect: jest.fn((cb) => cb())
    }
    const dbdao = new DBDao(clientMock);

    await expect(dbdao.connect()).resolves;

  });

  test('promise rejects with connection error on failure', async () => {

    const clientMock = {
      connect: jest.fn((cb) => cb('connection error'))
    }
    const dbdao = new DBDao(clientMock);

    await expect(dbdao.connect()).rejects.toEqual('connection error');

  });


});

describe('dbdao insert', () => {

  test('promise resolves when insert is successful', async () => {

    const clientMock = {
      connect: jest.fn((cb) => cb('connection error'))
    }
    const dbdao = new DBDao(clientMock);

    await expect(dbdao.connect()).rejects.toEqual('connection error');



  });

  test('promise rejects with error on insert failure', async () => {




  });

});

