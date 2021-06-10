Feature:  Test all game APIs

@StartGame
Scenario: Test start game API
	Given the game API is available AND there are two users
	When a new game has begun
	Then the game response should be HTTP '201'

@InvalidDrawWith4Cards
Scenario: Test game API - invalid draw
	Given the game API is available AND there are two users
	And a new game has begun
	When the player request a new card with a full hand
	Then the game response should be HTTP '403'

@InvalidPlayIntoLowerSpace
Scenario: Test game API - invalid play
	Given the game API is available AND there are two users
	And a new game has begun
	When the player plays a high card into an empty lower space
	Then the game response should be HTTP '403'

@InvalidPlayNotOwnedCard
Scenario: Test game API - invalid play
	Given the game API is available AND there are two users
	And a new game has begun
	When the player plays a card they dont hold
	Then the game response should be HTTP '403'

@ValidPlay
Scenario: Test game API - valid play
	Given the game API is available AND there are two users
	And a new game has begun
	When player one plays a valid move
	And player two plays a valid move
	Then the game response should be HTTP '200'

@ValidThenInvalidPlay
Scenario: Test game API - valid play / then invalid
	Given the game API is available AND there are two users
	And a new game has begun
	When move played into occupied board number
	Then the game response should be HTTP '403'

