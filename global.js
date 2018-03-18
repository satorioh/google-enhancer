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
		case "endless": {
			if (value) {
				endlessFun();
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
		case "shortcut": {
			if (value) {
				shortcutFun();
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
			alert(chrome.i18n.getMessage("flipPageToFirst"));
			return;
		} else {
			$("#pnprev")[0].click();
		}
	} else if (e.keyCode == 39) {
		// Press right right, next page
		if(!$("#pnnext")[0]){
			alert(chrome.i18n.getMessage("flipPageToLast"));
			return;
		} else {
			$("#pnnext")[0].click();
		}

	}
}
//——————————————————————————————————use arrow keys to flip pages——————————————————————

//——————————————————————————————————open link in new tab——————————————————————————————
let _newTabValue;
function newTabFun (value) {
	_newTabValue = value;
	let $links = $(`
		#tads a,
		#res a,
		#rhs a,
		#bottomads a,
		#extrares a
`);
	$links.attr("target", value ? "_blank" : "");
}
//——————————————————————————————————open link in new tab——————————————————————————————

//——————————————————————————————————search form pinned on top—————————————————————————
function sformPinnedFun() {
	let sformPinnedUrl = chrome.extension.getURL("css/sformpinned.css");
	let link = $(`<link rel="stylesheet" href=${sformPinnedUrl} id="geSformPinned">`);
	if (window.location.href.search('tbm=isch')==-1){
		$("head").append(link);
	}
}
//——————————————————————————————————search form pinned on top—————————————————————————

//——————————————————————————————————endless google————————————————————————————————————
/*
* refer to Endless Google
* @author tumpio
* @link: https://openuserjs.org/scripts/tumpio/tumpiosci.fi/Endless_Google
* @version 0.0.4
* and made some changes
*/

function endlessFun () {
	if (location.href.indexOf("tbm=isch") !== -1)
		return;
	if (window.top !== window.self)
		return;

	let request_pct = 0.05;
	let on_page_refresh = 1;
	let main = $("#main");
	let rcnt = $("#rcnt");
	let input = $("#lst-ib");
	let input_value = input.val();
	let old_scrollY = 0;
	let scroll_events = 0;
	let next_link = null;
	let cols = [];
	let request_offsetHeight = 0;
	let stop_events = false;

	$(window).on("scroll.ge",onScroll);
	$(window).on("beforeunload.ge",function () {window.scrollTo(0, 0);});

	function requestNextPage(link) {
		console.log("request next");
		console.log(link);
		$.ajax({
			method: "GET",
			url: link,
			success: function (response) {
				let el = document.getElementById('navcnt');
				el.parentNode.removeChild(el);

				let holder = document.createElement("div");
				holder.innerHTML = response;
				next_link = holder.querySelector("#pnnext").href;

				let next_col = document.createElement("div");
				next_col.className = "EG_col";
				next_col.appendChild(holder.querySelector("#center_col"));

				let rel_search = next_col.querySelector("#extrares");
				let rel_images = next_col.querySelector("#imagebox_bigimages");
				let rel_ads = next_col.querySelector("#tads");
				if (rel_search) rel_search.style.display = "none";
				if (rel_images) rel_images.style.display = "none";
				if (rel_ads) rel_ads.style.display = "none";

				cols.push(next_col);
				console.log("Page no: " + cols.length);
				next_col.id = next_col.className + "_" + (cols.length - 1);

				if (!rcnt || cols.length === 1) rcnt = document.getElementById("rcnt");
				rcnt.appendChild(next_col);
				//highlight keywords
				$("em").css({
					"color" : _kwColor,
					"backgroundColor" : `rgba(${_bgColor})`
				});
				//add target attribute for newtab function
				$("#res a").attr("target", _newTabValue ? "_blank" : "");
				stop_events = false;
				$(window).on("scroll.ge",onScroll);
			}
		});
	}

	function onScroll(e) {
		let y = window.scrollY;
		let delta = e.deltaY || y - old_scrollY;
		if (delta > 0 && (window.innerHeight + y) >= (document.body.clientHeight - (window.innerHeight * request_pct))) {
			console.log("scroll end");
			$(window).off("scroll.ge",onScroll);

			try {
				if(!stop_events){
					stop_events = true;
					requestNextPage(next_link || $("#pnnext").attr("href"));
				}
			} catch (err) {
				console.error(err.name + ": " + err.message);
			}
		}
		old_scrollY = y;
		scroll_events += 1;
	}
}
//——————————————————————————————————endless google————————————————————————————————————

//————————————————————————set keywords color & bgcolor & opacity——————————————————————
let _kwColor,_bgColor;

function kwColorAll (response) {
	let r = parseInt((response.kwBgColor).substring(1,3),16);
	let g = parseInt((response.kwBgColor).substring(3,5),16);
	let b = parseInt((response.kwBgColor).substring(5,7),16);
	_bgColor = `${r},${g},${b},${response.kwOpacity}`;
	_kwColor = response.kwColor;
	$("em").css({
		"color" : _kwColor,
		"backgroundColor" : `rgba(${_bgColor})`
	});
}
//————————————————————————set keywords color & bgcolor & opacity——————————————————————

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if(request.filetype.indexOf("timeRangeSearch") !== -1) timeRangeSearchFun(request);
	if(request.filetype === "ge.shortcut"){
		$("#popUpLayerMask").css("display","flex");
	};
});

//————————————————————————————————time range search———————————————————————————————————
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

//————————————————————————————————my shortcut sites———————————————————————————————————
function GePopUp () {
	this.ele =
	  $(`
		<div>
			<div class="popup-title-container">
				<div class="top-title">Add shortcut</div>
				<span id="popupCloseBtn" class="close"></span>
			</div>
			<div class="popup-content-container"></div>
			<div class="popup-foot-container"></div>
		</div>
		`);
	this.mask = $("<div></div>");
	this.init();
}

GePopUp.prototype = {
	init: function () {
		let $ele = $(this.ele);
		let $mask = $(this.mask);

		$ele.attr("id","popUpLayer");
		$mask.attr("id","popUpLayerMask");
		
		this.addContent();
		this.addPopUpStyle();
		$ele.on("click",function(e){
			e.stopPropagation();
		});
		$ele.on("click",this.domClick);
		$mask.append($ele);
		$("body").append($mask);
	},
	addPopUpStyle: function () {
		let head, style;
		let css = `
		  #popUpLayerMask {
		  	box-sizing: border-box;
			display: none;
            justify-content: center;
            align-items: center;
            position: fixed;
            top:0;
            right:0;
            bottom:0;
            left:0;
            background-color: rgba(0,0,0,.5);
            z-index: 10000;
            overflow: auto;
            min-height: 100%;
            transition:0.5s;
            /*opacity:0;*/
		}
		#popUpLayer {
			display: flex;
			flex-direction: column;
            flex-wrap: wrap;
            margin: auto;
            padding: 1em;
            background-color: #fff;
            border-radius: 2px;
            position: absolute;
            min-width: 500px;
            transition:0.5s;
		}
		.popup-title-container {
			display: flex;
			align-items: center;
		}
		.popup-title-container .top-title {
			flex: 1;
		}
		#popupCloseBtn {
			color: #757575;
			cursor: pointer;
		}
		#popupCloseBtn::before {
			content: "\\2716";
		}
		`;
		head = document.getElementsByTagName('head')[0];
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	},
	addContent: function () {
		
	},
	domClick: function (e) {
		let $target = $(e.target);
		if($target.hasClass("close")){
			$(this).parent().hide();
		}
	}
};

function shortcutFun () {
	//initial popup obj
	let shortcutPopUp = new GePopUp();
}
//————————————————————————————————my shortcut sites———————————————————————————————————