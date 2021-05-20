const gameService = require('../../service/game_service');

test('move - draw fail with full hand', async () => {

    const game = {
        players: [
            { userid: '1', cards: [1,2,3,4]}
        ]
    }

    const move = {
        move: 'Draw'
    }

    const dbdaoMock = {

    }

    const gs = new gameService(dbdaoMock);
    await expect(gs.move(game,'1',move)).rejects.toEqual({ error: 'full hand'});

});

test('move - draw success', async () => {

    const game = {
        deck: [23],
        moves:[],
        players: [
            { userid: '1', cards: [1,2,3]}
        ]
    }

    const move = {
        move: 'Draw'
    }

    const dbdaoMock = {
        replaceOne: jest.fn(() => { return { result: { ok: 1}}})
    }

    const gs = new gameService(dbdaoMock);
    const newGame = await gs.move(game, '1', move);

    expect(newGame.players[0].cards[3]).toEqual(23);
    expect(newGame.moves[0]).toEqual({"move": "Draw", "player": "1"});
    expect(newGame.deck.length).toEqual(0)

});


test('move - play card success', async () => {

    const game = {
        deck: [23],
        moves:[],
        board: [
            [{ num: 99, x: 9, y: 1 }]],
        players: [
            { userid: '1', cards: [1,99], color: `pink`}
        ]
    }

    const move = {
        move: 'Play',
        card: 99,
        boardNumber: 99
    }

    const dbdaoMock = {
        replaceOne: jest.fn(() => { return { result: { ok: 1}}})
    }

    const gs = new gameService(dbdaoMock);
    const newGame = await gs.move(game, '1', move);

    expect(newGame.players[0].cards[0]).toEqual(1);
    expect(newGame.board[0][0].color).toEqual(`pink`);
    expect(newGame.moves[0]).toEqual({"move": "Play", "player": "1", "card": 99,"boardNumber":99});
    expect(newGame.deck.length).toEqual(1)

});