Feature: User Login

Scenario: Unsuccessful login with valid credentials
  Given the user navigates to the login page
  When the user enters valid credentials
  And the user submits the login form

Scenario: Successful login
  Given I navigate to "youtube.com"
  Then I see "YouTube" in the title

Scenario: Google search
  Given I navigate to "https://google.com"
  And the user submits the login form
  Then I see "some results" in the results

Scenario: User navigates to facebook page
  Given I navigate to "https://facebook.com"
  Then I see "Facebook" in the title

Scenario: User navigates to google page
  Given I navigate to "https://google.com"
  Then I see "Google" in the title

    
