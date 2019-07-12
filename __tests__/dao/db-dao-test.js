const DBDao = require('../../dao/db-dao')


describe('dbdao delete table', () => {
  
  test('promise resolves with response when delete table successful', async () => {

    const dynamodbMock = {
      deleteTable: jest.fn((params, cb) => cb(null,"data"))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.deleteTable('table')).resolves.toEqual('data');

  });

  test('promise rejects with error when delete table failure', async () => {

    const dynamodbMock = {
      deleteTable: jest.fn((params, cb) => cb('delete failed'))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.deleteTable('table')).rejects.toEqual('delete failed');

  });

});

describe('dbdao create table', () => {
  
  test('promise resolves with response when create table successful', async () => {

    const dynamodbMock = {
      createTable: jest.fn((params, cb) => cb(null,"data"))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.createTable('table')).resolves.toEqual('data');

  });

  test('promise rejects with error when create table failure', async () => {

    const dynamodbMock = {
      createTable: jest.fn((params, cb) => cb('create failed'))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.createTable('table')).rejects.toEqual('create failed');

  });

});

describe('dbdao put item', () => {
  
  test('promise resolves with response when put item was successful', async () => {

    const dynamodbMock = {
      putItem: jest.fn((params, cb) => cb(null,"data"))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.putItem({})).resolves.toEqual('data');

  });

  test('promise rejects with error when put item failure', async () => {

    const dynamodbMock = {
      putItem: jest.fn((params, cb) => cb('put item failed'))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.putItem({})).rejects.toEqual('put item failed');

  });

});

describe('dbdao get item', () => {
  
  test('promise resolves with response when get item was successful', async () => {

    const dynamodbMock = {
      getItem: jest.fn((params, cb) => cb(null,"data"))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.getItem({})).resolves.toEqual('data');

  });

  test('promise rejects with error when put item failure', async () => {

    const dynamodbMock = {
      getItem: jest.fn((params, cb) => cb('get item failed'))
    }
    dbdao = new DBDao(dynamodbMock);

    await expect(dbdao.getItem({})).rejects.toEqual('get item failed');

  });

});