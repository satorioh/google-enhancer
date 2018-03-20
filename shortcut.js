let shortcutUrl = "";
let storage = chrome.storage.sync;

storage.get(function (response) {
	if(response.shortcut) shortcutFun();
});

//————————————————————————————————my shortcut sites———————————————————————————————————
function GePopUp () {
	this.ele =
	  $(`
		<div>
			<div class="popup-title-container">
				<div class="top-title">${chrome.i18n.getMessage("popUpTopTitle")}</div>
				<span id="popupCloseBtn" class="close"></span>
			</div>
			<div class="popup-content-container">
				<div class="content-label">${chrome.i18n.getMessage("popUpContentLabel")}</div>
				<input type="text" id="shortcutId" autofocus spellcheck="false">
			</div>
			<div class="popup-foot-container">
				<button class="close">${chrome.i18n.getMessage("popUpCloseBtn")}</button>
				<button class="action">${chrome.i18n.getMessage("popUpActionBtn")}</button>
			</div>
		</div>
		`);
	this.mask = $("<div></div>");
	this.init();
}

GePopUp.prototype = {
	init: function () {
		let $ele = $(this.ele);
		let $mask = $(this.mask);

		$ele.attr("id","gePopUpLayer");
		$mask.attr("id","gePopUpLayerMask");

		$ele.on("click",function(e){ e.stopPropagation(); })
			.on("click",this.domClick.bind(this))
			.keyup(function (e) {
				if(e.which == 27){ this.hidePopUp(); }
			}.bind(this));
		$mask.append($ele);
		$("body").append($mask);
		this.onMessage();
	},
	hidePopUp: function () {
		$(this.mask).hide();
		$('body').css("overflow","visible");
	},
	domClick: function (e) {
		let $target = $(e.target);
		if($target.hasClass("close")){
			this.hidePopUp();
		} else if($target.hasClass("action")){
			this.addStorage();
		}
	},
	setTopTitle: function (selector,txt) {
		$(selector).text(txt);
	},
	setInputVal: function (selector,txt) {
		$(selector).val(txt);
	},
	onMessage: function () {
		let that = this;
		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			console.log(request);
			if(request.filetype === "ge.shortcut"){
				request.pageUrl.replace(/\/\/(.*?)\//, function (match, p1) {
					shortcutUrl = p1;
					that.setTopTitle("#gePopUpLayer .top-title > span", p1);
					that.setInputVal("#gePopUpLayer #shortcutId", p1);
				});
				$("#gePopUpLayerMask").css("display","flex");
				$('body').css("overflow","hidden");
				$("#gePopUpLayer #shortcutId").focus();
			};
		});
	},
	addStorage: function () {
		let that = this;
		let obj = {
			title: $("#shortcutId").val(),
			url: shortcutUrl
		};
		storage.get("shortcutSite",function (result) {
			that.storageCheck("shortcutSite");
			result.shortcutSite.push(JSON.stringify(obj));
			console.log(result);
			storage.set(result,function () {
				if (chrome.runtime.lastError) {
					alert("Got error: " + chrome.runtime.lastError.message);
				} else {
					that.hidePopUp();
				}
			});
		})
	},
	storageCheck: function (key) {
		storage.getBytesInUse(key,function (bytesInUse) {
			if(bytesInUse >= 400){
				alert(chrome.i18n.getMessage("storageShortcutFull"));
				return false;
			};
		})
	}
};

function shortcutFun () {
	//initial popup obj
	let shortcutPopUp = new GePopUp();
}
//————————————————————————————————my shortcut sites———————————————————————————————————