"use strict";
//associate event & method with storage items
const pairs = [
	{
		"keyValue": "dblclickToTop",
		"event": "dblclick.ge",
		"method": dblclickToTopFun
	},
	{
		"keyValue": "flipPage",
		"event": "keyup.ge",
		"method": flipPageFun
	}
];

//find the same keyvalue as input value
function searchPair (key) {
	let result = {};
	for (let i = 0, len = pairs.length; i < len; i++) {
		let obj = pairs[i];
		if (obj.keyValue == key) {
			result.event = obj.event;
			result.method = obj.method;
			break;
		}
	}
	return result;
}

//initial dom & event
function initialEvent (key, value) {
	switch (key) {
		case "dblclickToTop":
		case "flipPage": {
			if (value) {//if value == 1,add event
				let result = searchPair(key);
				$("body").on(result.event, result.method);
			}
			break;
		}
		case "newTab": {
			newTabFun(value);
			break;
		}
		case "sformPinned": {
			if (value) {
				sformPinnedFun();
			}
			break;
		}
		case "nightMode": {
			if (value) {
				nightModeFun();
			}
			break;
		}
		case "cardStyle": {
			if (value) {
				cardStyleFun();
			}
			break;
		}
	}
}

chrome.storage.sync.get(function (response) {
	let keys = Object.keys(response);
	for (let i = 0,len = keys.length; i < len; i++) {
		let key = keys[i];
		let value = response[key];
		initialEvent(key, value);
	}
	kwColorAll(response);
});

//——————————————————————————————————Double click back to top——————————————————————————
function dblclickToTopFun () {
	window.getSelection().removeAllRanges();
	$("html, body").animate({scrollTop: 0}, 300);
}

//——————————————————————————————————Double click back to top——————————————————————————

//——————————————————————————————————use arrow keys to flip pages——————————————————————
function flipPageFun (e) {
	if ($("textarea").is(":focus") || $("input").is(":focus")) return;

	if (e.keyCode == 37) {
		// Press left key, previous page
		if(!$("#pnprev")[0]){
			alert("You've reached the first page.");
			return;
		} else {
			$("#pnprev")[0].click();
		}
	} else if (e.keyCode == 39) {
		// Press right right, next page
		if(!$("#pnnext")[0]){
			alert("You've reached the last page.");
			return;
		} else {
			$("#pnnext")[0].click();
		}

	}
}
//——————————————————————————————————use arrow keys to flip pages——————————————————————

//——————————————————————————————————open link in new tab——————————————————————————————
function newTabFun (value) {
	let $links = $(`
		#res a,
		#rhs a,
		#extrares a
`);
	$links.attr("target", value ? "_blank" : "");
}
//——————————————————————————————————open link in new tab——————————————————————————————

//——————————————————————————————————search form pinned on top——————————————————————————————
function sformPinnedFun() {
	let sformPinnedUrl = chrome.extension.getURL("css/sformpinned.css");
	let link = $(`<link rel="stylesheet" href=${sformPinnedUrl} id="geSformPinned">`);
	if (window.location.href.search('tbm=isch')==-1){
		$("head").append(link);
	}
}
//——————————————————————————————————search form pinned on top——————————————————————————————

//————————————————————————set keywords color & bgcolor & opacity——————————————————————
function kwColorAll (response) {
	let r = parseInt((response.kwBgColor).substring(1,3),16);
	let g = parseInt((response.kwBgColor).substring(3,5),16);
	let b = parseInt((response.kwBgColor).substring(5,7),16);
	let bgColor = `${r},${g},${b},${response.kwOpacity}`;
	$("em").css({
		"color" : response.kwColor,
		"backgroundColor" : `rgba(${bgColor})`
	});
}
//————————————————————————set keywords color & bgcolor & opacity——————————————————————

//————————————————————————————————time range search———————————————————————————————————
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	timeRangeSearchFun(request);
});

function timeRangeSearchFun (request) {
	let key = Object.keys(request)[0];
	let id = request[key].slice(19);
	if (id == "cdr_opt") {//custom range ...
		$("#cdr_opt span")[0].click();
	} else {
		$("#"+id+" > a")[0].click();
	}
}
//————————————————————————————————time range search———————————————————————————————————

//————————————————————————————————night mode——————————————————————————————————————————
function nightModeFun() {
	let nightModeUrl = chrome.extension.getURL("css/nightmode.css");
	let link = $(`<link rel="stylesheet" href=${nightModeUrl} id="geNightMode">`);
	$("head").append(link);
}
//————————————————————————————————night mode——————————————————————————————————————————
//————————————————————————————————card style UI———————————————————————————————————————
function cardStyleFun() {
	let cardStyleUrl = chrome.extension.getURL("css/cardstyle.css");
	let link = $(`<link rel="stylesheet" href=${cardStyleUrl} id="geCardStyle">`);
	if (window.location.href.search('tbm=isch')==-1){
		$("head").append(link);
	}
}
//————————————————————————————————card style UI———————————————————————————————————————
