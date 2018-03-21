/*
* refer to v2ex-plus
* @author sciooga
* @link: https://github.com/sciooga/v2ex-plus
* and made some changes
*/

"use strict";

let shortcutList = document.getElementById("shortcutList");//list frame for wrap list items

function saveChoice (e) {
	let name = e.target.name;
	let checked = e.target.checked;
	let value = checked ? 1 : 0;
	setItemByKey(name, value);
	if(name == "shortcut"){
		shortcutList.style.display = checked ? "block" : "none";
	}
}

function setItem (obj) {
	chrome.storage.sync.set(obj);
	chrome.storage.local.set(obj);
}

function setItemByKey (key, value) {
	let obj = {};
	obj[key] = value;
	chrome.storage.sync.set(obj);
	chrome.storage.local.set(obj);
}

function getItem (obj, callback) {
	chrome.storage.sync.get(obj, callback);
}

/*
    * Use arrow keys to flip pages : default true
    * Double click back to top : default true
    * Open link in new tab : default true
    * Search form pinned: default false
    * Endless Google: default false
    * Site search on context menu : default false
    * Filetype search on context menu: default false
    * Time range search on context menu: default false
    * Night mode: default false
    * Card style UI: default false
    * shortcutSite: array, always generate
*/
const defaultSettings = {
	"flipPage": 1,
	"dblclickToTop": 1,
	"newTab": 1,
	"siteSearch": 0,
	"shortcut": 0,
	"shortcutSite": [],
	"kwColor": "#dd4b39",
	"kwBgColor": "#ffffff",
	"kwOpacity": 0.4,
	"filetypeSearch": 0,
	"timeRangeSearch": 0,
	"nightMode": 0,
	"cardStyle": 0,
	"sformPinned": 0,
	"endless": 0
};

window.onload = function () {
	const settingButtons = {
		flipPage: document.querySelector(".flipPage"),
		dblclickToTop: document.querySelector(".dblclickToTop"),
		newTab: document.querySelector(".newTab"),
		siteSearch: document.querySelector(".siteSearch"),
		shortcut: document.querySelector(".shortcut"),
		kwColor: document.querySelector(".kwColor"),
		kwBgColor: document.querySelector(".kwBgColor"),
		kwOpacity: document.querySelector(".kwOpacity"),
		kwOpacityValue: document.getElementById("kwOpacityValue"),
		filetypeSearch: document.querySelector(".filetypeSearch"),
		timeRangeSearch: document.querySelector(".timeRangeSearch"),
		nightMode: document.querySelector(".nightMode"),
		cardStyle: document.querySelector(".cardStyle"),
		sformPinned: document.querySelector(".sformPinned"),
		endless: document.querySelector(".endless")
	};

	function resetAll () {
		setItem(defaultSettings);
		location.reload();
	}

	// Show saved settings
	function restoreSetting () {
		getItem(defaultSettings, (settings) => {
			for (let name in settings) {
				let value = settings[name];
				let button = settingButtons[name];
				let checked = true;
				switch (name) {
					case "kwColor":
					case "kwBgColor": {
						button.value = value;
						setItemByKey(name, value);
						button.onchange = function (e) {
							let hex = this.value.toLowerCase();
							setItemByKey(name, hex);
						};
						button.disabled = false;
						break;
					}
					case "kwOpacity": {
						button.value = value;
						settingButtons["kwOpacityValue"].textContent = value;
						setItemByKey(name, value);
						button.onchange = function () {
							settingButtons["kwOpacityValue"].textContent = this.value;
							setItemByKey(name, this.value);
						};
						button.disabled = false;
						break;
					}
					case "shortcutSite": {
						setItemByKey(name, value);
						break;
					}
					case "shortcut": {
						checked = !!parseInt(value);
						setItemByKey(name, parseInt(value));
						button.checked = checked;
						shortcutList.style.display = checked ? "block" : "none";
						button.onchange = saveChoice;
						button.disabled = false;
						break;
					}
					default: {
						checked = !!parseInt(value);
						setItemByKey(name, parseInt(value));
						button.checked = checked;
						button.onchange = saveChoice;
						button.disabled = false;
					}

				}
			}
		});
	}
	
	function i18n () {
		let objects = document.getElementsByTagName('*');
		for(let i = 0; i < objects.length; i++) {
			if (objects[i].dataset && objects[i].dataset.message) {
				objects[i].childNodes[0].textContent = chrome.i18n.getMessage(objects[i].dataset.message);
			}
		}
	}

	function GeListItem(title,id) {
		this.title = title;
		this.id = id;
		this.ele =	document.createElement("li");
		this.ele.dataset.index = `${id}`;
		this.ele.innerHTML = `
                    <label class="item">
                        <div class="item-content">${title}<div class="shortcut-site-url">${id}</div></div>
                        <div class="item-secondary">
                            <span class="close"></span>
                        </div>
                    </label>`;
		this.init();
	}

	GeListItem.prototype = {
		init: function () {
			let that = this;
			document.getElementById("shortcutList").appendChild(that.ele);
			that.ele.addEventListener("click",that.delItem);
		},
		delItem: function (e) {
			e.stopPropagation();
			let parent = e.target;
			if(e.target && e.target.className == "close"){
				while (parent = parent.parentElement || parent.parentNode){
					if (parent.nodeName == "LI") break;
				}
			}
			parent.parentNode.removeChild(parent);

			let index = parent.dataset.index;
			getItem("shortcutSite",function (result) {
				let arr = result.shortcutSite;
				for(let i = 0,len = arr.length; i < len; i++){
					let item = JSON.parse(arr[i]);
					if(item.id == index){
						arr.splice(i, 1);
						break;
					}
				}
				setItem({"shortcutSite": arr});
			});
		}
	};

	function setListItem (result,key) {
		let arr = result[key];
		if(arr == undefined) return; //for first install, storage may not generate
		for(let i = 0,len = arr.length; i < len; i++){
			let obj = JSON.parse(arr[i]);
			let item = new GeListItem(obj.title,obj.id);
		}
	}

	document.getElementById("allDefault").onclick = resetAll;
	i18n();
	getItem("shortcutSite",function (result) {
		setListItem(result,"shortcutSite");
	});
	restoreSetting();
};
