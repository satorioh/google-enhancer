"use strict";
const storage = chrome.storage.sync;
//———————————————————extension install & update————————————————————————
chrome.runtime.onInstalled.addListener(function (e) {
  // Open options page to initialize storage item
  if (e.reason === 'install')
    chrome.runtime.openOptionsPage()
  if (e.reason === 'update') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon/icon38.png',
      title: 'Google Enhancer updated',
      message: ''
    })
  }
})

//——————————————————————————————————site search on context menu———————————————————————
function siteSearchFun () {
  chrome.contextMenus.create({
    id: 'ge',
    title: "search '%s' in current site",
    contexts: ['selection']
  });
}
storage.get(function (response) {
  if(response.siteSearch){
    siteSearchFun();
  }
})

chrome.storage.onChanged.addListener(function (changes,namespace) {
  if(namespace !== "sync") return;
  if(!changes.siteSearch) return;
  if(changes.siteSearch.oldValue == undefined) return;
  if(changes.siteSearch.newValue){
    siteSearchFun();
  } else {
    chrome.contextMenus.remove("ge");
  }
})

chrome.contextMenus.onClicked.addListener(function (response) {
  if(response.menuItemId === "ge"){
    chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
      tab[0].url.replace(/\/\/(.*?)\//,function (match,p1) {
        window.open(`https://www.google.com/search?q=site:${p1}%20${response.selectionText}`);
      })
    })
  }
})
//——————————————————————————————————site search on context menu———————————————————————