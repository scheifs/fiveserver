Feature:  Test all game APIs

@StartGame
Scenario: Test start game API
	Given the game API is available AND there are two users
	When the client request a new game
	Then the game response should be HTTP '201'

@InvalidDrawWith4Cards
Scenario: Test game API - draw
	Given the game API is available AND there are two users
	When the player request a new card with a full hand
	Then the game response should be HTTP '403'


