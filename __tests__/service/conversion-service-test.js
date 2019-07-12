const conversionService = require('../../service/conversion-service');


describe('conversion-service db resposne to json', () => {

    test('promise rejects with error when delete table failure', async () => {

        const Item = {
            "email": { "S": "test@test.com" },
            "password": { "S": "abc123" }
        };
        const json = conversionService.itemToJSON(Item);

        expect(json.email).toEqual('test@test.com');
        expect(json.password).toEqual('abc123');
    });

});
