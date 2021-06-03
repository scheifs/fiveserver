Feature:  Test all game APIs

@StartGame
Scenario: Test start game API
	Given the game API is available AND there are two users
	When the client request a new game
	Then the game response should be HTTP '201'

@InvalidDrawWith4Cards
Scenario: Test game API - invalid draw
	Given the game API is available AND there are two users
	When the player request a new card with a full hand
	Then the game response should be HTTP '403'

@InvalidPlayIntoLowerSpace
Scenario: Test game API - invalid play
	Given the game API is available AND there are two users
	When the player plays a high card into an empty lower space
	Then the game response should be HTTP '403'

@InvalidPlayNotOwnedCard
Scenario: Test game API - invalid play
	Given the game API is available AND there are two users
	When the player plays a card they dont hold
	Then the game response should be HTTP '403'

# play card they don't have 403
# play card into space already occupied
