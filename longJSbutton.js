
// To run this sample
//  1. Copy the file to your local machine and give .js extension (i.e. example.js)
//  2. Change "***" to appropriate values
//  3. Install async and request packages
//     npm install async
//     npm install request
//  4. execute
//     node example.js
//


var     async = require("async"),       // async module
        request = require("request"),       // request module
        fs = require("fs");         // fs module

var     email = "glocdocusign+demo@gmail.com",              // your account email
        password = "JtaBTDC7b1piFrK2FgdAcy14iUI=",           // your account password
        integratorKey = "51252b97-d4d0-4d62-9d19-65f2b3c778e3",      // your Integrator Key (found on the Preferences -> API page)
        recipientName = "Gene JavaScripter",      // recipient (signer) name
        recipientEmail = "glocdocusign+JSTest@gmail.com",     // recipient email address
        documentName = "1Doc.pdf",       // copy document with this name into same directory!
        envelopeId = "",            // will retrieve this from second api call
        baseUrl = "";               // retrieved through the Login call

async.waterfall(
  [
    /////////////////////////////////////////////////////////////////////////////////////
    // Step 1: Login (used to retrieve your accountId and baseUrl)
    /////////////////////////////////////////////////////////////////////////////////////
    function(next) {
        var url = "https://demo.docusign.net/restapi/v2/login_information";
        var body = "";  // no request body for login api call

        // set request url, method, body, and headers
        var options = initializeRequest(url, "GET", body, email, password);

        // send the request...
        request(options, function(err, res, body) {
            if(!parseResponseBody(err, res, body)) {
                return;
            }
            baseUrl = JSON.parse(body).loginAccounts[0].baseUrl;
            next(null); // call next function
        });
    },

    /////////////////////////////////////////////////////////////////////////////////////
    // Step 2: Create Envelope with Embedded Recipient (need to set |clientUserId| property)
    /////////////////////////////////////////////////////////////////////////////////////
    function(next) {
        var url = baseUrl + "/envelopes";
        // following request body will place 1 signature tab 100 pixels to the right and
        // 100 pixels down from the top left of the document that you send in the request
        var body = {
            "recipients": {
                "signers": [{
                    "email": recipientEmail,
                    "name": recipientName,
                    "recipientId": 1,
                    "clientUserId": "1001",     //Required for embedded recipient
                    "tabs": {
                        "signHereTabs": [{
                            "xPosition": "100",
                            "yPosition": "100",
                            "documentId": "1",
                            "pageNumber": "1"
                        }]
                    }
                }]
            },
            "emailSubject": 'DocuSign API - Signature Request on Document Call',
            "documents": [{
                "name": documentName,
                "documentId": 1,
            }],
            "status": "sent"
        };

        // set request url, method, body, and headers
        var options = initializeRequest(url, "POST", body, email, password);

        // change default Content-Type header from "application/json" to "multipart/form-data"
        options.headers["Content-Type"] = "multipart/form-data";

        // configure a multipart http request with JSON body and document bytes
        options.multipart = [{
                    "Content-Type": "application/json",
                    "Content-Disposition": "form-data",
                    "body": JSON.stringify(body),
                }, {
                    "Content-Type": "application/pdf",
                    'Content-Disposition': 'file; filename="' + documentName + '"; documentId=1',
                    "body": fs.readFileSync(documentName),
                }
        ];

        // send the request...
        request(options, function(err, res, body) {
            if(!parseResponseBody(err, res, body)) {
                return;
            }
            envelopeId = JSON.parse(body).envelopeId;
            next(null); // call next function
        });
    }, // end function

    /////////////////////////////////////////////////////////////////////////////////////
    // Step 3: Generate the Embedded Signing URL
    /////////////////////////////////////////////////////////////////////////////////////

    function(next) {
        var url = baseUrl + "/envelopes/" + envelopeId + "/views/recipient";
        var method = "POST";
        var body = JSON.stringify({
                "returnUrl": "http://www.docusign.com/devcenter",
                "authenticationMethod": "email",
                "email": email,
                "userName": recipientName,
                "clientUserId": "1001", // must match clientUserId in step 2!
            });

        // set request url, method, body, and headers
        var options = initializeRequest(url, "POST", body, email, password);

        // send the request...
        request(options, function(err, res, body) {
            if(!parseResponseBody(err, res, body))
                return;
            else
                console.log("\nNavigate to the above URL to start the Embedded Signing workflow...");
        });
    }
]);

//***********************************************************************************************
// --- HELPER FUNCTIONS ---
//***********************************************************************************************
function initializeRequest(url, method, body, email, password) {
    var options = {
        "method": method,
        "uri": url,
        "body": body,
        "headers": {}
    };
    addRequestHeaders(options, email, password);
    return options;
}

///////////////////////////////////////////////////////////////////////////////////////////////
function addRequestHeaders(options, email, password) {
    // JSON formatted authentication header (XML format allowed as well)
    dsAuthHeader = JSON.stringify({
        "Username": email,
        "Password": password,
        "IntegratorKey": integratorKey  // global
    });
    // DocuSign authorization header
    options.headers["X-DocuSign-Authentication"] = dsAuthHeader;
}

///////////////////////////////////////////////////////////////////////////////////////////////
function parseResponseBody(err, res, body) {
    console.log("\r\nAPI Call Result: \r\n", JSON.parse(body));
    if( res.statusCode != 200 && res.statusCode != 201) { // success statuses
        console.log("Error calling webservice, status is: ", res.statusCode);
        console.log("\r\n", err);
        return false;
    }
    return true;
}
