let urls = [];
chrome.storage.sync.get("urls", function (x) {
    if (x.urls && x.urls.length > 0) {
        urls = x.urls;
        for (let i = 0; i < urls.length; i++) {
            drawRow(i, urls[i])
        }
    }
});

let saveButton = document.getElementById("save");
saveButton.addEventListener("click", async () => {
    const newUrl = document.getElementById("newUrl").value;
    document.getElementById("newUrl").value = "";
    urls.push(newUrl)
    drawRow(maxId(), newUrl)
    updateBlocker(urls)
});

function maxId() {
    let max = 0
    for (let i = 0; i < document.getElementById('container').children.length - 1; i++) {
        const id = document.getElementById('container').children[i].id;
        if (id > max) {
            max = id
        }
    }
    return max + 1;
}

function drawRow(id, value) {
    document.getElementById('container').insertAdjacentHTML('afterbegin', `<div id="${id}" class="row"> <input type="text" placeholder="URL" value="${value}"/> <button class="delete">Delete</button> </div>`)
    const deleteButton = document.getElementById(id).getElementsByTagName('button')[0]
    deleteButton.addEventListener("click", async (e) => {
        const rowToRemove = document.getElementById(e.target.parentElement.id)
        const urlToRemove = rowToRemove.getElementsByTagName('input')[0].value
        urls.splice(urls.indexOf(urlToRemove), 1);
        rowToRemove.remove()
        updateBlocker(urls)
    });
}

function updateBlocker(newUrls) {
    chrome.storage.sync.set({ urls: newUrls })
    newUrls.forEach(url => {
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
}