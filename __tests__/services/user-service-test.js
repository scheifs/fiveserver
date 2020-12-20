const UserService = require('../../service/user_service');
const { ObjectId } = require('mongodb');


test('addUser: promise rejects with user is already registered', async () => {

    const user = {
        email: 'email@blah.com',
        password: 'password'
    };

    this.userService = new UserService({
        findOneWithSearchCriteria: jest.fn(() => true)
    });


    await expect(this.userService.addUser(user)).rejects.toEqual({ "error": "duplicate user" });

});

test('addUser: promise resolves with valid user data', async () => {

    const user = {
        email: 'email@blah.com',
        password: 'password'
    };
    const newUser = {
        email: 'email@blah.com',
        nickname: 'email',
    }

    this.userService = new UserService({
        findOneWithSearchCriteria: jest.fn(() => false),
        insert: jest.fn(() => newUser)
    });

    await expect(this.userService.addUser(user)).resolves.toEqual(newUser);

});

test('addGame: async function resolves when game added successfully', async () => {

    this.userService = new UserService({
        findOneWithSearchCriteria: jest.fn(() => true),
        addToSet: jest.fn(() => 'dbresponse')
    });

    await expect(this.userService.addGame(ObjectId(), ObjectId())).resolves.toBe('dbresponse');

});

test('hashPassword: promise resolves with hashed password', async () => {

    this.userService = new UserService(jest.fn(), 'db', 'col');

    const pwdHash = await this.userService.hashPassword('password', 'salt');

    expect(pwdHash).toBe('f5d17022c96af46c0a1dc49a58bbe654a28e98104883e4af4de974cda2c74122dd082f4105a93fc80692ca4eb1a784cfeda81bfaa33f5192cc9143d818bd758104bb2fd0dcfcfe53c1e717bed7069e29fd9cac1f0a483eb7481ca2b76395a4004b8784975561803c9958e0979ee6deac2beba00983640adc5ccebe6c8ebdf20c66808fc9a394042282083c8f37581ae3290f3bad90f4a3888343dac38c7eff4793bfb251c3180750329700da5e9f4d4d5caf9c46674b4d659ac5cd82e0767189cafdc2ec41684dc60af93e36ba95250f8223e64908bbadc2856af0280edbc8893f2d0db41c29b1d31e059ce921c32bcbc33067db9b43ecffdd31e6c6b2f3362b476914755b1c4349cade2bcbbd0afe971f1cf6a62274ce3741a149cc0d92f9c607d1fa17c555cab360b51b66293afb4b07ca0d41df47cd5f6596c27a1aafc96053f534e9ef9ffd08e95e5de5eb4acde76ac3855134b3954e6e2df3808714a71bbb3290e185f115391e6e616c74cda0ea68a753ec51cf3452c0965229b944959e2dce7240cf8bc5c201c5409963d56e32e6dbfa00b62a2fd90d417ed515d6f0944573b3db12c014d3a113c2f3f82f0fe10f88c7aad119c2502dd99cf896af1517d20bf047259c423116baf4b5fa0b8c4bc8aa52ada9eb2daf3283badafb5862e26011719ca7323540e28eb58f24f851fc9b68a582f1308d961cab4b33f92ebf3e');

});

test('isPasswordCorrect: returns true when correct', async () => {

    const passwordMatch = await this.userService.isPasswordCorrect('password', 'salt', 'f5d17022c96af46c0a1dc49a58bbe654a28e98104883e4af4de974cda2c74122dd082f4105a93fc80692ca4eb1a784cfeda81bfaa33f5192cc9143d818bd758104bb2fd0dcfcfe53c1e717bed7069e29fd9cac1f0a483eb7481ca2b76395a4004b8784975561803c9958e0979ee6deac2beba00983640adc5ccebe6c8ebdf20c66808fc9a394042282083c8f37581ae3290f3bad90f4a3888343dac38c7eff4793bfb251c3180750329700da5e9f4d4d5caf9c46674b4d659ac5cd82e0767189cafdc2ec41684dc60af93e36ba95250f8223e64908bbadc2856af0280edbc8893f2d0db41c29b1d31e059ce921c32bcbc33067db9b43ecffdd31e6c6b2f3362b476914755b1c4349cade2bcbbd0afe971f1cf6a62274ce3741a149cc0d92f9c607d1fa17c555cab360b51b66293afb4b07ca0d41df47cd5f6596c27a1aafc96053f534e9ef9ffd08e95e5de5eb4acde76ac3855134b3954e6e2df3808714a71bbb3290e185f115391e6e616c74cda0ea68a753ec51cf3452c0965229b944959e2dce7240cf8bc5c201c5409963d56e32e6dbfa00b62a2fd90d417ed515d6f0944573b3db12c014d3a113c2f3f82f0fe10f88c7aad119c2502dd99cf896af1517d20bf047259c423116baf4b5fa0b8c4bc8aa52ada9eb2daf3283badafb5862e26011719ca7323540e28eb58f24f851fc9b68a582f1308d961cab4b33f92ebf3e');

    expect(passwordMatch).toBeTruthy();

});

test('isPasswordCorrect: returns true when correct', async () => {

    const passwordMatch = await this.userService.isPasswordCorrect('notmypwd', 'salt', 'f5d17022c96af46c0a1dc49a58bbe654a28e98104883e4af4de974cda2c74122dd082f4105a93fc80692ca4eb1a784cfeda81bfaa33f5192cc9143d818bd758104bb2fd0dcfcfe53c1e717bed7069e29fd9cac1f0a483eb7481ca2b76395a4004b8784975561803c9958e0979ee6deac2beba00983640adc5ccebe6c8ebdf20c66808fc9a394042282083c8f37581ae3290f3bad90f4a3888343dac38c7eff4793bfb251c3180750329700da5e9f4d4d5caf9c46674b4d659ac5cd82e0767189cafdc2ec41684dc60af93e36ba95250f8223e64908bbadc2856af0280edbc8893f2d0db41c29b1d31e059ce921c32bcbc33067db9b43ecffdd31e6c6b2f3362b476914755b1c4349cade2bcbbd0afe971f1cf6a62274ce3741a149cc0d92f9c607d1fa17c555cab360b51b66293afb4b07ca0d41df47cd5f6596c27a1aafc96053f534e9ef9ffd08e95e5de5eb4acde76ac3855134b3954e6e2df3808714a71bbb3290e185f115391e6e616c74cda0ea68a753ec51cf3452c0965229b944959e2dce7240cf8bc5c201c5409963d56e32e6dbfa00b62a2fd90d417ed515d6f0944573b3db12c014d3a113c2f3f82f0fe10f88c7aad119c2502dd99cf896af1517d20bf047259c423116baf4b5fa0b8c4bc8aa52ada9eb2daf3283badafb5862e26011719ca7323540e28eb58f24f851fc9b68a582f1308d961cab4b33f92ebf3e');

    expect(passwordMatch).not.toBeTruthy();

});

test('addGame: async function rejects when game not found', async () => {

    this.userService = new UserService({
        findOneWithSearchCriteria: jest.fn(() => false),
    });

    expect.assertions(1);
    try {
        await this.userService.addGame(ObjectId(), ObjectId());
    } catch (e) {
        expect(e.error).toMatch(/gameid/);
    }

});



