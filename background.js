"use strict";
const storageChange = [
    {
        "keyValue": "dblclickToTop",
        "event": "dblclick.ge",
        "method": dblclickToTopFun
    },
    {
        "keyValue": "flipPage",
        "event": "keyup.ge",
        "method": flipPageFun
    },
];

function searchKeyValue(key) {
    let result = {};
    for(let i = 0, len = storageChange.length; i < len; i++){
        let obj = storageChange[i];
        if(obj.keyValue == key){
            result.event = obj.event;
            result.method = obj.method;
            break;
        }
    }
    return result;
}

function changeHandler(changes,key) {
    let result = searchKeyValue(key);
    if(changes[key].newValue){
        $("body").on(result.event,result.method);
    } else {
        $("body").off(result.event,result.method);
    }
}

chrome.storage.sync.get(function (response) {
    for(let key in response){
        if(response[key]){
            let result = searchKeyValue(key);
            $("body").on(result.event,result.method);
        }
    }
});

chrome.storage.onChanged.addListener(function (changes,namespace) {
    if(namespace !== "sync") return;
    console.log(Object.keys(changes));
    let key = Object.keys(changes)[0];
    changeHandler(changes,key);
});

//——————————————————————————————————Double click back to top——————————————————————————————————
function dblclickToTopFun() {
    window.getSelection().removeAllRanges();
    $("html, body").animate({scrollTop: 0}, 300);
}
//——————————————————————————————————Double click back to top——————————————————————————————————

//——————————————————————————————————use arrow keys to flip pages——————————————————————————————
function flipPageFun(e) {
    if ($("textarea").is(":focus") || $("input").is(":focus")) return;

    if (e.keyCode == 37) {
        // Press left key, previous page
        $("#pnprev")[0].click();
    } else if (e.keyCode == 39) {
        // Press right right, next page
        $("#pnnext")[0].click();
    }
}
//——————————————————————————————————use arrow keys to flip pages———————————————————————————————