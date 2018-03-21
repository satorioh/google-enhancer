"use strict";
const storage = chrome.storage.sync;
//———————————————————extension install & update————————————————————————
chrome.runtime.onInstalled.addListener(function (e) {
	// Open options page to initialize storage item
	if (e.reason === "install")
		chrome.runtime.openOptionsPage();
	if (e.reason === "update") {
		chrome.notifications.create({
			type: "basic",
			iconUrl: "icon/icon38.png",
			title: chrome.i18n.getMessage("extUpdateTitle"),
			message: chrome.i18n.getMessage("extUpdateMsg")
		});
	}
});
//———————————————————extension install & update————————————————————————

//open option page when click icon
chrome.browserAction.onClicked.addListener(function () {
	chrome.runtime.openOptionsPage();
});

//———————————————————define obj & array————————————————————————
const contextMenuParents = {
	siteSearch:{
		id: "ge.siteSearch",
		title: chrome.i18n.getMessage("siteSearch"),
		contexts: ["selection"]
	},
	filetypeSearch:{
		id: "ge.filetypeSearch",
	  	title: chrome.i18n.getMessage("filetypeSearch"),
		contexts: ["page"],
	  	documentUrlPatterns: [
		"*://www.google.com/*",
		"*://www.google.ad/*",
		"*://www.google.ae/*",
		"*://www.google.com.af/*",
		"*://www.google.com.ag/*",
		"*://www.google.com.ai/*",
		"*://www.google.al/*",
		"*://www.google.am/*",
		"*://www.google.co.ao/*",
		"*://www.google.com.ar/*",
		"*://www.google.as/*",
		"*://www.google.at/*",
		"*://www.google.com.au/*",
		"*://www.google.az/*",
		"*://www.google.ba/*",
		"*://www.google.com.bd/*",
		"*://www.google.be/*",
		"*://www.google.bf/*",
		"*://www.google.bg/*",
		"*://www.google.com.bh/*",
		"*://www.google.bi/*",
		"*://www.google.bj/*",
		"*://www.google.com.bn/*",
		"*://www.google.com.bo/*",
		"*://www.google.com.br/*",
		"*://www.google.bs/*",
		"*://www.google.bt/*",
		"*://www.google.co.bw/*",
		"*://www.google.by/*",
		"*://www.google.com.bz/*",
		"*://www.google.ca/*",
		"*://www.google.cd/*",
		"*://www.google.cf/*",
		"*://www.google.cg/*",
		"*://www.google.ch/*",
		"*://www.google.ci/*",
		"*://www.google.co.ck/*",
		"*://www.google.cl/*",
		"*://www.google.cm/*",
		"*://www.google.cn/*",
		"*://www.google.com.co/*",
		"*://www.google.co.cr/*",
		"*://www.google.com.cu/*",
		"*://www.google.cv/*",
		"*://www.google.com.cy/*",
		"*://www.google.cz/*",
		"*://www.google.de/*",
		"*://www.google.dj/*",
		"*://www.google.dk/*",
		"*://www.google.dm/*",
		"*://www.google.com.do/*",
		"*://www.google.dz/*",
		"*://www.google.com.ec/*",
		"*://www.google.ee/*",
		"*://www.google.com.eg/*",
		"*://www.google.es/*",
		"*://www.google.com.et/*",
		"*://www.google.fi/*",
		"*://www.google.com.fj/*",
		"*://www.google.fm/*",
		"*://www.google.fr/*",
		"*://www.google.ga/*",
		"*://www.google.ge/*",
		"*://www.google.gg/*",
		"*://www.google.com.gh/*",
		"*://www.google.com.gi/*",
		"*://www.google.gl/*",
		"*://www.google.gm/*",
		"*://www.google.gp/*",
		"*://www.google.gr/*",
		"*://www.google.com.gt/*",
		"*://www.google.gy/*",
		"*://www.google.com.hk/*",
		"*://www.google.hn/*",
		"*://www.google.hr/*",
		"*://www.google.ht/*",
		"*://www.google.hu/*",
		"*://www.google.co.id/*",
		"*://www.google.ie/*",
		"*://www.google.co.il/*",
		"*://www.google.im/*",
		"*://www.google.co.in/*",
		"*://www.google.iq/*",
		"*://www.google.is/*",
		"*://www.google.it/*",
		"*://www.google.je/*",
		"*://www.google.com.jm/*",
		"*://www.google.jo/*",
		"*://www.google.co.jp/*",
		"*://www.google.co.ke/*",
		"*://www.google.com.kh/*",
		"*://www.google.ki/*",
		"*://www.google.kg/*",
		"*://www.google.co.kr/*",
		"*://www.google.com.kw/*",
		"*://www.google.kz/*",
		"*://www.google.la/*",
		"*://www.google.com.lb/*",
		"*://www.google.li/*",
		"*://www.google.lk/*",
		"*://www.google.co.ls/*",
		"*://www.google.lt/*",
		"*://www.google.lu/*",
		"*://www.google.lv/*",
		"*://www.google.com.ly/*",
		"*://www.google.co.ma/*",
		"*://www.google.md/*",
		"*://www.google.me/*",
		"*://www.google.mg/*",
		"*://www.google.mk/*",
		"*://www.google.ml/*",
		"*://www.google.com.mm/*",
		"*://www.google.mn/*",
		"*://www.google.ms/*",
		"*://www.google.com.mt/*",
		"*://www.google.mu/*",
		"*://www.google.mv/*",
		"*://www.google.mw/*",
		"*://www.google.com.mx/*",
		"*://www.google.com.my/*",
		"*://www.google.co.mz/*",
		"*://www.google.com.na/*",
		"*://www.google.com.nf/*",
		"*://www.google.com.ng/*",
		"*://www.google.com.ni/*",
		"*://www.google.ne/*",
		"*://www.google.nl/*",
		"*://www.google.no/*",
		"*://www.google.com.np/*",
		"*://www.google.nr/*",
		"*://www.google.nu/*",
		"*://www.google.co.nz/*",
		"*://www.google.com.om/*",
		"*://www.google.com.pa/*",
		"*://www.google.com.pe/*",
		"*://www.google.com.pg/*",
		"*://www.google.com.ph/*",
		"*://www.google.com.pk/*",
		"*://www.google.pl/*",
		"*://www.google.pn/*",
		"*://www.google.com.pr/*",
		"*://www.google.ps/*",
		"*://www.google.pt/*",
		"*://www.google.com.py/*",
		"*://www.google.com.qa/*",
		"*://www.google.ro/*",
		"*://www.google.ru/*",
		"*://www.google.rw/*",
		"*://www.google.com.sa/*",
		"*://www.google.com.sb/*",
		"*://www.google.sc/*",
		"*://www.google.se/*",
		"*://www.google.com.sg/*",
		"*://www.google.sh/*",
		"*://www.google.si/*",
		"*://www.google.sk/*",
		"*://www.google.com.sl/*",
		"*://www.google.sn/*",
		"*://www.google.so/*",
		"*://www.google.sm/*",
		"*://www.google.sr/*",
		"*://www.google.st/*",
		"*://www.google.com.sv/*",
		"*://www.google.td/*",
		"*://www.google.tg/*",
		"*://www.google.co.th/*",
		"*://www.google.com.tj/*",
		"*://www.google.tk/*",
		"*://www.google.tl/*",
		"*://www.google.tm/*",
		"*://www.google.tn/*",
		"*://www.google.to/*",
		"*://www.google.com.tr/*",
		"*://www.google.tt/*",
		"*://www.google.com.tw/*",
		"*://www.google.co.tz/*",
		"*://www.google.com.ua/*",
		"*://www.google.co.ug/*",
		"*://www.google.co.uk/*",
		"*://www.google.com.uy/*",
		"*://www.google.co.uz/*",
		"*://www.google.com.vc/*",
		"*://www.google.co.ve/*",
		"*://www.google.vg/*",
		"*://www.google.co.vi/*",
		"*://www.google.com.vn/*",
		"*://www.google.vu/*",
		"*://www.google.ws/*",
		"*://www.google.rs/*",
		"*://www.google.co.za/*",
		"*://www.google.co.zm/*",
		"*://www.google.co.zw/*",
		"*://www.google.cat/*",
		"https://encrypted.google.com/*",
		"https://ipv6.google.com/*"
	]
	},
	timeRangeSearch:{
		id: "ge.timeRangeSearch",
		title: chrome.i18n.getMessage("timeRangeSearch"),
		contexts: ["page"],
		documentUrlPatterns: [
			"*://www.google.com/*",
			"*://www.google.ad/*",
			"*://www.google.ae/*",
			"*://www.google.com.af/*",
			"*://www.google.com.ag/*",
			"*://www.google.com.ai/*",
			"*://www.google.al/*",
			"*://www.google.am/*",
			"*://www.google.co.ao/*",
			"*://www.google.com.ar/*",
			"*://www.google.as/*",
			"*://www.google.at/*",
			"*://www.google.com.au/*",
			"*://www.google.az/*",
			"*://www.google.ba/*",
			"*://www.google.com.bd/*",
			"*://www.google.be/*",
			"*://www.google.bf/*",
			"*://www.google.bg/*",
			"*://www.google.com.bh/*",
			"*://www.google.bi/*",
			"*://www.google.bj/*",
			"*://www.google.com.bn/*",
			"*://www.google.com.bo/*",
			"*://www.google.com.br/*",
			"*://www.google.bs/*",
			"*://www.google.bt/*",
			"*://www.google.co.bw/*",
			"*://www.google.by/*",
			"*://www.google.com.bz/*",
			"*://www.google.ca/*",
			"*://www.google.cd/*",
			"*://www.google.cf/*",
			"*://www.google.cg/*",
			"*://www.google.ch/*",
			"*://www.google.ci/*",
			"*://www.google.co.ck/*",
			"*://www.google.cl/*",
			"*://www.google.cm/*",
			"*://www.google.cn/*",
			"*://www.google.com.co/*",
			"*://www.google.co.cr/*",
			"*://www.google.com.cu/*",
			"*://www.google.cv/*",
			"*://www.google.com.cy/*",
			"*://www.google.cz/*",
			"*://www.google.de/*",
			"*://www.google.dj/*",
			"*://www.google.dk/*",
			"*://www.google.dm/*",
			"*://www.google.com.do/*",
			"*://www.google.dz/*",
			"*://www.google.com.ec/*",
			"*://www.google.ee/*",
			"*://www.google.com.eg/*",
			"*://www.google.es/*",
			"*://www.google.com.et/*",
			"*://www.google.fi/*",
			"*://www.google.com.fj/*",
			"*://www.google.fm/*",
			"*://www.google.fr/*",
			"*://www.google.ga/*",
			"*://www.google.ge/*",
			"*://www.google.gg/*",
			"*://www.google.com.gh/*",
			"*://www.google.com.gi/*",
			"*://www.google.gl/*",
			"*://www.google.gm/*",
			"*://www.google.gp/*",
			"*://www.google.gr/*",
			"*://www.google.com.gt/*",
			"*://www.google.gy/*",
			"*://www.google.com.hk/*",
			"*://www.google.hn/*",
			"*://www.google.hr/*",
			"*://www.google.ht/*",
			"*://www.google.hu/*",
			"*://www.google.co.id/*",
			"*://www.google.ie/*",
			"*://www.google.co.il/*",
			"*://www.google.im/*",
			"*://www.google.co.in/*",
			"*://www.google.iq/*",
			"*://www.google.is/*",
			"*://www.google.it/*",
			"*://www.google.je/*",
			"*://www.google.com.jm/*",
			"*://www.google.jo/*",
			"*://www.google.co.jp/*",
			"*://www.google.co.ke/*",
			"*://www.google.com.kh/*",
			"*://www.google.ki/*",
			"*://www.google.kg/*",
			"*://www.google.co.kr/*",
			"*://www.google.com.kw/*",
			"*://www.google.kz/*",
			"*://www.google.la/*",
			"*://www.google.com.lb/*",
			"*://www.google.li/*",
			"*://www.google.lk/*",
			"*://www.google.co.ls/*",
			"*://www.google.lt/*",
			"*://www.google.lu/*",
			"*://www.google.lv/*",
			"*://www.google.com.ly/*",
			"*://www.google.co.ma/*",
			"*://www.google.md/*",
			"*://www.google.me/*",
			"*://www.google.mg/*",
			"*://www.google.mk/*",
			"*://www.google.ml/*",
			"*://www.google.com.mm/*",
			"*://www.google.mn/*",
			"*://www.google.ms/*",
			"*://www.google.com.mt/*",
			"*://www.google.mu/*",
			"*://www.google.mv/*",
			"*://www.google.mw/*",
			"*://www.google.com.mx/*",
			"*://www.google.com.my/*",
			"*://www.google.co.mz/*",
			"*://www.google.com.na/*",
			"*://www.google.com.nf/*",
			"*://www.google.com.ng/*",
			"*://www.google.com.ni/*",
			"*://www.google.ne/*",
			"*://www.google.nl/*",
			"*://www.google.no/*",
			"*://www.google.com.np/*",
			"*://www.google.nr/*",
			"*://www.google.nu/*",
			"*://www.google.co.nz/*",
			"*://www.google.com.om/*",
			"*://www.google.com.pa/*",
			"*://www.google.com.pe/*",
			"*://www.google.com.pg/*",
			"*://www.google.com.ph/*",
			"*://www.google.com.pk/*",
			"*://www.google.pl/*",
			"*://www.google.pn/*",
			"*://www.google.com.pr/*",
			"*://www.google.ps/*",
			"*://www.google.pt/*",
			"*://www.google.com.py/*",
			"*://www.google.com.qa/*",
			"*://www.google.ro/*",
			"*://www.google.ru/*",
			"*://www.google.rw/*",
			"*://www.google.com.sa/*",
			"*://www.google.com.sb/*",
			"*://www.google.sc/*",
			"*://www.google.se/*",
			"*://www.google.com.sg/*",
			"*://www.google.sh/*",
			"*://www.google.si/*",
			"*://www.google.sk/*",
			"*://www.google.com.sl/*",
			"*://www.google.sn/*",
			"*://www.google.so/*",
			"*://www.google.sm/*",
			"*://www.google.sr/*",
			"*://www.google.st/*",
			"*://www.google.com.sv/*",
			"*://www.google.td/*",
			"*://www.google.tg/*",
			"*://www.google.co.th/*",
			"*://www.google.com.tj/*",
			"*://www.google.tk/*",
			"*://www.google.tl/*",
			"*://www.google.tm/*",
			"*://www.google.tn/*",
			"*://www.google.to/*",
			"*://www.google.com.tr/*",
			"*://www.google.tt/*",
			"*://www.google.com.tw/*",
			"*://www.google.co.tz/*",
			"*://www.google.com.ua/*",
			"*://www.google.co.ug/*",
			"*://www.google.co.uk/*",
			"*://www.google.com.uy/*",
			"*://www.google.co.uz/*",
			"*://www.google.com.vc/*",
			"*://www.google.co.ve/*",
			"*://www.google.vg/*",
			"*://www.google.co.vi/*",
			"*://www.google.com.vn/*",
			"*://www.google.vu/*",
			"*://www.google.ws/*",
			"*://www.google.rs/*",
			"*://www.google.co.za/*",
			"*://www.google.co.zm/*",
			"*://www.google.co.zw/*",
			"*://www.google.cat/*",
			"https://encrypted.google.com/*",
			"https://ipv6.google.com/*"
		]
	},
	shortcut:{
		id: "ge.shortcut",
		title: chrome.i18n.getMessage("shortcut"),
		contexts: ["page"]
	}
};

const fileTypeArr = [
	{
		title:"pdf",
		id:"pdf"
	},
	{
		title:"doc",
		id:"doc"
	},
	{
		title:"xls",
		id:"xls"
	},
	{
		title:"ppt",
		id:"ppt"
	},
	{
		title:"ps",
		id:"ps"
	},
	{
		title:"dwf",
		id:"dwf"
	},
	{
		title:"kml",
		id:"kml"
	},
	{
		title:"kmz",
		id:"kmz"
	},
	{
		title:"rtf",
		id:"rtf"
	},
	{
		title:"swf",
		id:"swf"
	}
];
const timeRangeArr = [
	{
		title:chrome.i18n.getMessage("timeAnyTime"),
		id:"qdr_"
	},
	{
		title:chrome.i18n.getMessage("timePastHour"),
		id:"qdr_h"
	},
	{
		title:chrome.i18n.getMessage("timePastDay"),
		id:"qdr_d"
	},
	{
		title:chrome.i18n.getMessage("timePastWeek"),
		id:"qdr_w"
	},
	{
		title:chrome.i18n.getMessage("timePastMonth"),
		id:"qdr_m"
	},
	{
		title:chrome.i18n.getMessage("timePastYear"),
		id:"qdr_y"
	},
	{
		title:chrome.i18n.getMessage("timeCustom"),
		id:"cdr_opt"
	}
];
const siteSearchCurrent = {
	id: "current",
	title: chrome.i18n.getMessage("siteSearchCurrent"),
	contexts: ["selection"]
};

//—————————————————————————site/file/time search on context menu—————————————————
function errorHandler () {
		if (chrome.runtime.lastError) {
			console.log("Got expected error: " + chrome.runtime.lastError.message);
		}
}

function createParentMenu (obj) {
		chrome.contextMenus.create(obj,errorHandler());
		if(obj.id == "ge.filetypeSearch"){createSubMenu(fileTypeArr,obj);}
		if(obj.id == "ge.timeRangeSearch"){createSubMenu(timeRangeArr,obj);}
		if(obj.id == "ge.siteSearch"){
			storage.get("shortcutSite",function (result) {
				let shortcutArr = result.shortcutSite;
				createSubMenu(shortcutArr,obj);
			})
		}
}

function createSubMenu(arr,parent) {
	if(parent.id == "ge.siteSearch"){
		arr.unshift(siteSearchCurrent);
	}
	for (let i = 0; i < arr.length; i++){
		let obj = arr[i];
		if(typeof obj == "string"){
			obj = JSON.parse(obj);
		}
		let id = parent.id + "_" + obj.id;
		let title = obj.title;
		let contexts = parent.contexts;
		chrome.contextMenus.create({
			"id": id,
			"parentId": parent.id,
			"title": title,
			"contexts": contexts
		},errorHandler())
	}
}

function onChangedHandler (changes) {
	let keys = Object.keys(changes);
	for (let i = 0,len = keys.length; i < len; i++){
		let index = keys[i];
		let item = changes[index];
		switch (index){
			case "siteSearch":
			case "filetypeSearch":
			case "timeRangeSearch":
			case "shortcut":
			{
				if (item.newValue) {
					let obj = contextMenuParents[index];
					delete obj.generatedId;
					createParentMenu(obj);
				} else {
					chrome.contextMenus.remove(contextMenuParents[index].id);
				}
				break;
			}
			case "shortcutSite":
				{
					let obj = contextMenuParents.siteSearch;
					delete obj.generatedId;
					chrome.contextMenus.remove(contextMenuParents.siteSearch.id);
					createParentMenu(obj);
			}
		}
	}
}

function siteSearchClicked (response) {
	let url = response.menuItemId.slice(14);
	if(url == "current"){
		response.pageUrl.replace(/\/\/(.*?)\//, function (match, p1) {
			window.open(`https://www.google.com/search?q=site:${p1}%20${response.selectionText}`);
		});
	} else {
		window.open(`https://www.google.com/search?q=site:${url}%20${response.selectionText}`);
	}

}

function filetypeSearchClicked (response) {
	let type = response.menuItemId.slice(-3);
	response.pageUrl.replace(/[&?]q=(.+?)[&+]/, function (match, p1) {
		window.open(`https://www.google.com/search?&q=${p1}+filetype:${type}`);
	});
}

function sendToFront (response) {
	chrome.tabs.query({active:true, currentWindow:true}, function (tab) {
		chrome.tabs.sendMessage(tab[0].id, {
			filetype: response.menuItemId,
			pageUrl: response.pageUrl
		});
	});
}

function onClickedHandler (response) {
	if(response.parentMenuItemId){
		switch (response.parentMenuItemId) {
			case "ge.filetypeSearch": {
				filetypeSearchClicked(response);
				break;
			}
			case "ge.timeRangeSearch": {
				sendToFront(response);
				break;
			}
			case "ge.siteSearch":
			{
				siteSearchClicked(response);
				break;
			}
		}
	} else {
		switch (response.menuItemId) {
			case "ge.shortcut":
			{
				sendToFront(response);
				break;
			}
		}
	}
}

//initial context menu when extension updated
storage.get(function (response) {
	if (response.siteSearch) {createParentMenu(contextMenuParents.siteSearch);}
	if (response.filetypeSearch) {createParentMenu(contextMenuParents.filetypeSearch);}
	if (response.timeRangeSearch) {createParentMenu(contextMenuParents.timeRangeSearch);}
	if (response.shortcut) {createParentMenu(contextMenuParents.shortcut);}
});

//onchanged operation
chrome.storage.onChanged.addListener(function (changes, namespace) {
	if (namespace !== "sync") return;
	for(let key in changes){
		if (changes[key].oldValue == undefined){//new install no operation
			delete changes[key];
		}
	}
	onChangedHandler(changes);
});

//onclicked operation
chrome.contextMenus.onClicked.addListener(function (response) {
	console.log(response);
	onClickedHandler(response);
});
//———————————————————————site/file/time search on context menu———————————————