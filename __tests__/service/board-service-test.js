const boardService = require('../../service/board_service');

test('add move to game board', async () => {

    const updatedBoard = boardService.addMoveToBoard(1, 73, 'red', JSON.parse(JSON.stringify(boardService.emptyBoard)));

    expect(updatedBoard[0][0].color).toBe('red');
    expect(updatedBoard[0][0].playerId).toBe(1);

});

test('getSquareAtBoardNum' , async () => {

    const boardSquare = boardService.getSquareAtBoardNum(99, boardService.emptyBoard);

    expect(boardSquare.num).toBe(99);


});

test('isSameColor5Direction - right - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x < 10; x++) {
        board[x][9].color = 'red';
    }

    const yes = boardService.isSameColor5Direction(board, 5, 9, boardService.directions.RIGHT);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - right - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x <= 9; x++) {
        board[x][0].color = 'red';
    }

    const no = boardService.isSameColor5Direction(board, 7, 0, boardService.directions.RIGHT);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - left - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x < 10; x++) {
        board[x][9].color = 'red';
    }

    const yes = boardService.isSameColor5Direction(board, 4, 9, boardService.directions.LEFT);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - left - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x <= 9; x++) {
        board[x][0].color = 'red';
    }

    const no = boardService.isSameColor5Direction(board, 0, 0, boardService.directions.LEFT);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - up - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let y = 0; y < 10; y++) {
        board[0][y].color = 'red';
    }

    const yes = boardService.isSameColor5Direction(board, 0, 9, boardService.directions.UP);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - up - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x <= 9; x++) {
        board[x][0].color = 'red';
    }

    const no = boardService.isSameColor5Direction(board, 0, 0, boardService.directions.UP);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - down - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let y = 0; y < 10; y++) {
        board[0][y].color = 'red';
    }

    const yes = boardService.isSameColor5Direction(board, 0, 0, boardService.directions.DOWN);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - down - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x <= 9; x++) {
        board[x][0].color = 'red';
    }

    const no = boardService.isSameColor5Direction(board, 0, 7, boardService.directions.DOWN);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - up left - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let y = 0; y < 10; y++) {
        board[y][y].color = 'red';
    }

    const yes = boardService.isSameColor5Direction(board, 9, 9, boardService.directions.UPandLEFT);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - up left - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x <= 9; x++) {
        board[x][0].color = 'red';
    }

    const no = boardService.isSameColor5Direction(board, 0, 7, boardService.directions.UPandLEFT);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - up right - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let y = 0; y < 10; y++) {
        board[y][9-y].color = 'red';
    }

    const yes = boardService.isSameColor5Direction(board, 0, 9, boardService.directions.UPandRIGHT);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - up right - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x <= 9; x++) {
        board[x][0].color = 'red';
    }

    const no = boardService.isSameColor5Direction(board, 0, 7, boardService.directions.UPandRIGHT);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - down left - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let y = 0; y < 10; y++) {
        board[y][9-y].color = 'red';
    }

    boardService.printBoard(board);

    const yes = boardService.isSameColor5Direction(board, 9, 0, boardService.directions.DOWNandLEFT);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - down left - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    board[0][0].color = 'red';

    const no = boardService.isSameColor5Direction(board, 0, 0, boardService.directions.DOWNandLEFT);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - down right - true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let y = 0; y < 10; y++) {
        board[y][y].color = 'red';
    }

    boardService.printBoard(board);

    const yes = boardService.isSameColor5Direction(board, 0, 0, boardService.directions.DOWNandRIGHT);

    expect(yes).toBeTruthy();

});

test('isSameColor5Direction - down right - out of bounds - false' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    board[9][9].color = 'red';

    const no = boardService.isSameColor5Direction(board, 9, 9, boardService.directions.DOWNandRIGHT);

    expect(no).toBeFalsy();

});

test('isSameColor5Direction - no color on initial square' , async () => {

    const no = boardService.isSameColor5Direction(boardService.emptyBoard, 0, 0, 'right');

    expect(no).toBeFalsy();

});


test('areAllSquaresSameColor -- true' , async () => {

    const board = JSON.parse(JSON.stringify(boardService.emptyBoard));
    for (let x = 0; x < 5; x++) {
        board[x][0].color = 'red';
    }

    const yes = boardService.areAllSquaresSameColor('red',[board[0][0],board[1][0],board[2][0]])

    expect(yes).toBeTruthy();

});

test('areAllSquaresSameColor -- false' , async () => {

    const board = [...boardService.emptyBoard];
    for (let x = 0; x < 1; x++) {
        board[x][0].color = 'red';
    }

    const no = boardService.areAllSquaresSameColor('red',[board[0][0],board[1][0],board[2][0]])

    expect(no).toBeFalsy();

});