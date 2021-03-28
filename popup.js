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
    const newUrl = new URL(document.getElementById("newUrl").value);
    document.getElementById("newUrl").value = "";
    urls.push(`${newUrl.protocol}//${newUrl.hostname}/*`)
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
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            return {
                redirectUrl: "http://www.google.com/",
            };
        },
        {
            urls: newUrls,
        },
        ["blocking"]
    );
}