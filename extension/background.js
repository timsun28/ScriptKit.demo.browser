let port = browser.runtime.connectNative("script_app");

port.onMessage.addListener((response) => {
    // Here we can access a request from Scriptkit and process the request
    // This would be something like: getAllTabs or getActiveTab
    // This will than trigger one of the functions in the browser addon that will send a message back.
    console.log("Received: " + response);
});

// Function to get all current tabs and send it to the Scriptkit app
function getAllTabs() {
    var gettingAllTabs = browser.tabs.query({});
    gettingAllTabs.then((tabs) => {
        console.log(tabs);
    });
    port.postMessage(JSON.stringify(getAllTabs));
}
