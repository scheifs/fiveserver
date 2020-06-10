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

    const dbCollectionMock = {
      insertOne: jest.fn(() => {
        return {
          ops: [
            "insert"
          ]
        }
      })
    };


    console.log(dbCollectionMock.insertOne('doc'));

    const dbMock = {
      collection: jest.fn(() => dbCollectionMock)
    }
    const clientMock = {
      db: jest.fn(() => dbMock)
    }

    const dbdao = new DBDao(clientMock);

    await expect(dbdao.insert('db', 'collection', {})).resolves.toEqual('insert');



  });

  test('promise rejects with error on insert failure', async () => {

    const err = "error";

    const clientMock = {
      connect: jest.fn((cb) => cb(clientMock)),
      db: jest.fn(() => { throw err})
    }

    const dbdao = new DBDao(clientMock);
    
    await expect(dbdao.insert('db', 'collection', {})).rejects.toEqual('error');


  });

});

