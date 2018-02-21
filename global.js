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

//initial event
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
		}
	}
}

chrome.storage.sync.get(function (response) {
	for (let key in response) {
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
		$("#pnprev")[0].click();
	} else if (e.keyCode == 39) {
		// Press right right, next page
		$("#pnnext")[0].click();
	}
}

//——————————————————————————————————use arrow keys to flip pages——————————————————————

//——————————————————————————————————open link in new tab——————————————————————————————
function newTabFun (value) {
	let $links = $("h3.r > a:first-child");
	$links.attr("target", value ? "_blank" : "");
}
//——————————————————————————————————open link in new tab——————————————————————————————

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

//————————————————————————filetype search—————————————————————————————————————————————
window.onload = function () {
	let sprite = chrome.runtime.getURL("img/spritesheet.png");
	let html = $(`
					<ul id="file-search-list">
						<li><a href="javascript:void(0)" class="sprite sprite-pdf"></a></li>
						<li><a href="javascript:void(0)" class="sprite sprite-doc"></a></li>
						<li><a href="javascript:void(0)" class="sprite sprite-xls"></a></li>
						<li><a href="javascript:void(0)" class="sprite sprite-ppt"></a></li>
						<li><a href="javascript:void(0)" class="sprite sprite-file"></a></li>
					</ul>
				`);
	$("#gs_st0").prepend(html);
	$(".sprite").css("background-image",`url(${sprite})`);
	let $lis = $(".sprite:lt(4)").parent();
	$("body").on({
		mouseenter: function(){
			$lis.animate({
				opacity:1,
				marginRight:"+10px"
			},500);
		},
		mouseleave: function () {
			$lis.animate({
				opacity:0,
				marginRight:"0"
			},500);
		}},".sprite-file")
};


//————————————————————————filetype search—————————————————————————————————————————————
