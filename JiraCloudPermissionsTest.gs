// Copyright 2019 Broad Institute
// SPDX-License-Identifier: BSD-3-Clause
// https://opensource.org/licenses/BSD-3-Clause

// Globals
'use strict';

/**
* Test that the Google Cloud Function CanUserUploadToJiraCloud
*
* @param {} No input parameters
* @return {} No return code
*/
//
// Name: JiraCloudPermissionsTest
// Author: Bruce Kozuma
//
// Version: 0.1
// Date: 2019/12/04
// - Initial release
//
//
function JiraCloudPermissionsTest()
{
  // Constants
  const cScriptName = 'JiraCloudPermissionsTest';


  // Get the UI
  const cUI = SpreadsheetApp.getUi();


  // Get email of user invoking this script
  // Production
  const cUserEmail = Session.getActiveUser().getEmail();
  // Debug
//  const cUserEmail = 'd' + Session.getActiveUser().getEmail();
//  cUI.alert('User email: ' + cUserEmail);


  // Set project
  const cProjectKey = 'SCRSP';


  // JSON Object for parameters
  let data = {
    'projectKey': cProjectKey,
    'emailAddress': cUserEmail
  };
  let payload = JSON.stringify(data);


  // User clicked OK, so call function
  // CanUploadToJiraCloudProject
  const URL = 'https://us-central1-regevlab-scrsp-reporting.cloudfunctions.net/CanUserUploadToJiraCloud';


  // Header information, including authorization information.
  // This API call is linked to an account in Jira, and follows the Basic Authentication method
  // ("username:password" are Base64 encoded)
  // Note: email:password!
  // IMPORTANT: Take out Base64 encoded information before checking into GitHub!!!!
  const cHeaders = {
      "content-type": "application/json",
      "Accept": "application/json",
  //    "Authorization": "Basic <username>:<password>"

  };


  // Options for the JSON string to send
  // Method is POST (for new Issues or existing Issues to be updating with a new stauts),
  // PUT (for existing Issues to be updated without a change in status), or
  // GET (to retrieve information about an existing Issue)
  // For muteHttpExceptions:
  // - Use true to get less ugly notifications for end users
  // - Use false to get raw reports from Jira
  let options = {
    "content-type": "application/json",
    "method": 'GET',
    "headers": cHeaders,
    "payload": payload,
    "muteHttpExceptions": false

  };


  // Make the HTTP call to the JIRA API
  let response;
  try {
    response = UrlFetchApp.fetch(URL, options);

  } catch(e) {
    console.log(e.message);

  } // Make the HTTP call to the JIRA API
  console.log('Response code: ' + JSON.stringify(response.getResponseCode()));
  console.log('Returned text: ' + JSON.stringify(response.getContentText()));


  // Check for return code
  let returnCode = response.getResponseCode();
  switch (returnCode) {
    case 200: {
      // Email address does have Project Administrator privileges
      // and thus can run the Jira Cloud - G Suite integration code
      cUI.alert(cScriptName + ' response text: ' + response.getContentText());
      console.log(cScriptName + ' ' + cUserEmail + ' does have permissions');

      break;

    } // Email address does have Project Administrator privileges

    case 202: {
      // Email address does NOT have Project Administrator privileges
      // and thus CANNOT run the Jira Cloud - G Suite integration code
      cUI.alert(cScriptName + ": '" + response.getContentText() + "'");
      console.log(cScriptName + ' ' + cUserEmail + ' does not have permissions');

      break;

    } // Email address does NOT have Project Administrator privileges

    default: {
      // Issue was not created or updated
      // beef this up a lot
      console.log(cScriptName + response.getContentText());
      break;

    } // default

  } // Check for return code

} // JiraCloudPermissionsTest
