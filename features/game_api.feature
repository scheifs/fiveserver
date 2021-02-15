Feature:  Test all game APIs

@StartGame
Scenario: Test start game API
	Given the API is available
	When the client request a new game
	Then the response should be HTTP '201'


