Feature:  Test all user APIs

@AddUser
Scenario: Test add user API
	Given the API is available
	When the client request to add a nonexisting user via POST /api/users
	Then the response should be HTTP '201'