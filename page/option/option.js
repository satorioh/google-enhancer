"use strict";
function saveChoice(e){
    let name = e.target.name;
    let checked = e.target.checked;
    let value = checked ? 1 : 0;
    setItemByKey(name, value);
}

function setItem(obj) {
    chrome.storage.sync.set(obj);
    chrome.storage.local.set(obj);
}

function setItemByKey(key, value) {
    let obj = {};
    obj[key] = value;
    chrome.storage.sync.set(obj);
    chrome.storage.local.set(obj);
}

function getItem(obj, callback) {
    chrome.storage.sync.get(obj, callback);
}

/*
    * Use arrow keys to flip pages : default true
    * Double click back to top : default true
*/
const defaultSettings = {
    "flipPage": 1,
    "dblclickToTop": 1
};

window.onload = function() {
    const settingButtons = {
        flipPage: document.querySelector(".flipPage"),
        dblclickToTop: document.querySelector(".dblclickToTop")
    };

    function resetAll() {
        setItem(defaultSettings);
        location.reload();
    }

    // Show saved settings
    function restoreSetting() {
        getItem(defaultSettings, (settings) => {
        for (let name in settings) {
            let value = settings[name];
            let button = settingButtons[name];
            let checked = true;
            switch (name) {
                default:
                        checked = !!parseInt(value);
                        setItemByKey(name,parseInt(value));
                    button.checked = checked;
                    button.onchange = saveChoice;
                    button.disabled = false;
            }
        }
    })
    }

    restoreSetting();
};
