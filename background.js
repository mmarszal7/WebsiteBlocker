chrome.storage.sync.get("urls", function (data) {
    const urls = data.urls;
    if (urls === undefined || urls.length == 0) {
        return;
    }

    urls.forEach(url => {
        chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [{
                'id': 1001,
                'priority': 1,
                'action': {
                    'type': 'block'
                },
                'condition': {
                    'urlFilter': url,
                    'resourceTypes': [
                        'csp_report', 'font', 'image', 'main_frame', 'media', 'object', 'other', 'ping', 'script',
                        'stylesheet', 'sub_frame', 'webbundle', 'websocket', 'webtransport', 'xmlhttprequest'
                    ]
                }
            }],
            removeRuleIds: [1001]
        })
    });
});