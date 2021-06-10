const gameService = require('../../service/game_service');

test('move - throw not supported exception', async () => {

    const move = {
        move: 'unknonw'
    }
    const error = {
        error: `move not supported ${JSON.stringify(move)}`
    }
    const gs = new gameService();

    await expect(gs.move({}, '1', move)).rejects.toEqual(error);

});

test('move - draw fail with full hand', async () => {

    const game = {
        players: [
            { userid: '1', cards: [1, 2, 3, 4] }
        ]
    }

    const move = {
        move: 'Draw'
    }

    const dbdaoMock = {

    }

    const gs = new gameService(dbdaoMock);
    await expect(gs.move(game, '1', move)).rejects.toEqual({ error: 'full hand' });

});

test('move - draw success', async () => {

    const game = {
        deck: [23],
        moves: [],
        turnNumber: 1,
        players: [
            { userid: '1', cards: [1, 2, 3] }
        ]
    }

    const move = {
        move: 'Draw'
    }

    const dbdaoMock = {
        replaceOne: jest.fn(() => { return { result: { ok: 1 } } })
    }

    const gs = new gameService(dbdaoMock);
    const newGame = await gs.move(game, '1', move);

    expect(newGame.players[0].cards[3]).toEqual(23);
    expect(newGame.moves[0]).toEqual({ "move": "Draw", "player": "1" });
    expect(newGame.deck.length).toEqual(0)

});


test('move - play card success', async () => {

    const game = {
        deck: [23],
        moves: [],
        turnNumber: 1,
        board: [
            [{ num: 99, x: 9, y: 1 }]],
        players: [
            { userid: '1', cards: [1, 99], color: `pink` }
        ]
    }

    const move = {
        move: 'Play',
        card: 99,
        boardNumber: 99
    }

    const dbdaoMock = {
        replaceOne: jest.fn(() => { return { result: { ok: 1 } } })
    }

    const gs = new gameService(dbdaoMock);
    const newGame = await gs.move(game, '1', move);

    expect(newGame.players[0].cards[0]).toEqual(1);
    expect(newGame.board[0][0].color).toEqual(`pink`);
    expect(newGame.moves[0]).toEqual({ "move": "Play", "player": "1", "card": 99, "boardNumber": 99 });
    expect(newGame.deck.length).toEqual(1)

});


test('shuffle - deck shuffled', async () => {

    const deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const originalDeck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const gs = new gameService();
    gs.shuffle(deck);

    let rearranged = false;

    for (let x = 0; x < deck.length; x++) {
        if (originalDeck[x] !== deck[x]) {
            rearranged = true;
            break;
        }
    }

    if (!rearranged) {
        throw Error('deck not shuffled');
    }


});


test('getNewShuffledDeck - deck shuffled', async () => {

    const deck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const gs = new gameService();
    const shuffledDeck = gs.getNewShuffledDeck();

    let rearranged = false;

    for (let x = 0; x < deck.length; x++) {
        if (shuffledDeck[x] !== deck[x]) {
            rearranged = true;
            break;
        }
    }

    if (!rearranged) {
        throw Error('deck not shuffled');
    }

});


test('dealToPlayers - players get cards', async () => {

    const game = {
        players: [
            { cards: [] },
            { cards: [] }
        ],
        deck: [1, 2, 3, 4, 5, 6, 7, 8]
    }

    const gs = new gameService();
    gs.dealToPlayers(game);

    expect(game.players[0].cards.length).toEqual(4);
    expect(game.players[1].cards.length).toEqual(4);


});

test('getNextTurnPlayersId', async () => {

    const players = [{ userid: 'a' }, { userid: 'b' }, { userid: 'c' }];

    const gs = new gameService();
    expect(gs.getNextTurnPlayersId(players,2)).toEqual('b');
    expect(gs.getNextTurnPlayersId(players,3)).toEqual('c');
    expect(gs.getNextTurnPlayersId(players,4)).toEqual('a');
    expect(gs.getNextTurnPlayersId(players,5)).toEqual('b');
    expect(gs.getNextTurnPlayersId(players,6)).toEqual('c');
    

});