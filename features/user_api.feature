Feature:  Test all user APIs

@GetToken
Scenario: Test get token API
	Given the API is available
	When the client request to get a json web token
	Then the response should be HTTP '200'


@AddUser
Scenario: Test add user API
	Given the API is available
	When the client request to add a nonexisting user via POST /api/users
	Then the response should be HTTP '201'

@AddDuplicateUser
Scenario: Test add user API
	Given the API is available
	When the client request to add an existing user via POST /api/users
	Then the response should be HTTP '409'