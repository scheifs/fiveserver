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

describe('dbdao disconnect', () => {

  test('client calls logout on disconnect', async () => {

    const clientMock = {
      logout: jest.fn()
    };
    const dbdao = new DBDao(clientMock);

    await dbdao.disconnect();
    expect(clientMock.logout).toHaveBeenCalled();

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
      db: jest.fn(() => { throw err })
    }

    const dbdao = new DBDao(clientMock);

    await expect(dbdao.insert('db', 'collection', {})).rejects.toEqual('error');


  });

});

describe('findOneWithSearchCriteria', () => {

  let dbCollectionMock;
  let databaseMock;
  let clientMock;
  let dbdao;

  beforeEach(() => {

    dbCollectionMock = jest.fn();

    databaseMock = {
      collection: jest.fn(() => dbCollectionMock)
    }

    clientMock = {
      db: jest.fn(() => databaseMock)
    }

    dbdao = new DBDao(clientMock);
  });

  test('promise resolves with search result', async () => {

    dbCollectionMock = {
      findOne: jest.fn(() => { return "foundOne"})
    };  
    
    await expect(dbdao.findOneWithSearchCriteria(databaseMock, "collection", {})).resolves.toBe('foundOne');

  });

  test('promise rejects with error on findOne failure', async () => {

    dbCollectionMock = {
      findOne: jest.fn(() => { throw "found error"})
    };  
    
    await expect(dbdao.findOneWithSearchCriteria(databaseMock, "collection", {})).rejects.toBe('found error');

  });


});

describe('findWithSearchCriteria', () => {

  let dbCollectionMock;
  let databaseMock;
  let clientMock;
  let dbdao;

  beforeEach(() => {

    dbCollectionMock = jest.fn();

    databaseMock = {
      collection: jest.fn(() => dbCollectionMock)
    }

    clientMock = {
      db: jest.fn(() => databaseMock)
    }

    dbdao = new DBDao(clientMock);
  });

  test('promise resolves with search result', async () => {

    const resp = "[a,b]";

    const dbResponse = {
      toArray: jest.fn(() => resp)
    }

    dbCollectionMock = {
      find: jest.fn(() => dbResponse)
    };  
    
    await expect(dbdao.findWithSearchCriteria(databaseMock, "collection", {})).resolves.toBe(resp);

  });

  test('promise rejects with error on search failure', async () => {

    dbCollectionMock = {
      find: jest.fn(() => { throw "find error"})
    };   
    
    await expect(dbdao.findWithSearchCriteria(databaseMock, "collection", {})).rejects.toBe('find error');

  });


});

describe('deleteMany', () => {

  let dbCollectionMock;
  let databaseMock;
  let clientMock;
  let dbdao;

  beforeEach(() => {

    dbCollectionMock = jest.fn();

    databaseMock = {
      collection: jest.fn(() => dbCollectionMock)
    }

    clientMock = {
      db: jest.fn(() => databaseMock)
    }

    dbdao = new DBDao(clientMock);
  });

  test('promise resolves with delete many result', async () => {

    dbCollectionMock = {
      deleteMany: jest.fn(() => { return "deleted"})
    };  
    
    await expect(dbdao.deleteMany(databaseMock, "collection", {})).resolves.toBe('deleted');

  });

  test('promise rejects with error on delete failure', async () => {

    dbCollectionMock = {
      deleteMany: jest.fn(() => { throw "delete error"})
    };  
    
    await expect(dbdao.deleteMany(databaseMock, "collection", {})).rejects.toBe('delete error');

  });


});

describe('replaceOne', () => {

  let dbCollectionMock;
  let databaseMock;
  let clientMock;
  let dbdao;

  beforeEach(() => {

    dbCollectionMock = jest.fn();

    databaseMock = {
      collection: jest.fn(() => dbCollectionMock)
    }

    clientMock = {
      db: jest.fn(() => databaseMock)
    }

    dbdao = new DBDao(clientMock);
  });

  test('promise resolves with replaceOne many result', async () => {

    dbCollectionMock = {
      replaceOne: jest.fn(() => { return "replaceOne"})
    };  
    
    await expect(dbdao.replaceOne(databaseMock, "collection", "filter", "replacement")).resolves.toBe('replaceOne');

    expect(dbCollectionMock.replaceOne).toHaveBeenCalledWith("filter","replacement");

  });

  test('promise rejects with error on replaceOne failure', async () => {

    dbCollectionMock = {
      replaceOne: jest.fn(() => { throw "replaceOne error"})
    };  
    
    await expect(dbdao.replaceOne(databaseMock, "collection", {})).rejects.toBe('replaceOne error');

  });


});


describe('findOneAndUpdate', () => {

  let dbCollectionMock;
  let databaseMock;
  let clientMock;
  let dbdao;

  beforeEach(() => {

    dbCollectionMock = jest.fn();

    databaseMock = {
      collection: jest.fn(() => dbCollectionMock)
    }

    clientMock = {
      db: jest.fn(() => databaseMock)
    }

    dbdao = new DBDao(clientMock);
  });

  test('promise resolves with findOneAndUpdate many result', async () => {

    dbCollectionMock = {
      findOneAndUpdate: jest.fn(() => { return "findOneAndUpdate"})
    };  
    
    await expect(dbdao.findOneAndUpdate(databaseMock, "collection", "findquery", "updates")).resolves.toBe('findOneAndUpdate');


  });

  test('promise rejects with error on findOneAndUpdate failure', async () => {

    dbCollectionMock = {
      findOneAndUpdate: jest.fn(() => { throw "findOneAndUpdate error"})
    };  
    
    await expect(dbdao.findOneAndUpdate(databaseMock, "collection", "findquery", "updates")).rejects.toBe('findOneAndUpdate error');

  });


});

describe('addToSet', () => {

  let dbCollectionMock;
  let databaseMock;
  let clientMock;
  let dbdao;

  beforeEach(() => {

    dbCollectionMock = jest.fn();

    databaseMock = {
      collection: jest.fn(() => dbCollectionMock)
    }

    clientMock = {
      db: jest.fn(() => databaseMock)
    }

    dbdao = new DBDao(clientMock);
  });

  test('promise resolves with addToSet many result', async () => {

    dbCollectionMock = {
      updateOne: jest.fn(() => { return "addToSet"})
    };  
    
    await expect(dbdao.addToSet(databaseMock, "collection", "findquery", "updates")).resolves.toBe('addToSet');


  });

  test('promise rejects with error on addToSet failure', async () => {

    dbCollectionMock = {
      updateOne: jest.fn(() => { throw "addToSet error"})
    };  
    
    await expect(dbdao.addToSet(databaseMock, "collection", "findquery", "updates")).rejects.toBe('addToSet error');

  });


});

