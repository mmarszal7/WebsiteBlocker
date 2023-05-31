chrome.storage.sync.get("urls", function (data) {
    const urls = data.urls;
    if (urls === undefined || urls.length == 0) {
        return;
    }

    chrome.declarativeNetRequest.getDynamicRules((rules) => {
        rules.forEach(rule => {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [rule.id]
            })
        });

        urls.forEach((url, index) => {
            if (url == null || url == "") return;

            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [{
                    'id': 1000 + index,
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
                removeRuleIds: [1000 + index]
            })
        });
    })
});