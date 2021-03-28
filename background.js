chrome.storage.sync.get("urls", function (data) {
    const urls = data.urls;
    if (urls === undefined || urls.length == 0) {
        return;
    }

    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            return {
                redirectUrl: "https://google.com/",
            };
        },
        {
            urls: urls,
        },
        ["blocking"]
    );

    chrome.webRequest.onHeadersReceived.addListener(
        function (details) { },
        {
            urls: ["http://*/*", "https://*/*"],
        },
        ["blocking", "responseHeaders"]
    );
});