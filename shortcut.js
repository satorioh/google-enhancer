let shortcutUrl = "";
let storage = chrome.storage.sync;
storage.get(function (response) {
	if(response.shortcut) shortcutFun();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request);
	if(request.filetype === "ge.shortcut"){
		request.pageUrl.replace(/\/\/(.*?)\//, function (match, p1) {
			shortcutUrl = p1;
			$("#gePopUpLayer .top-title > span ").text(p1);
			$("#gePopUpLayer #shortcutId").val(p1);
		});
		$("#gePopUpLayerMask").css("display","flex");
		$('body').css("overflow","hidden");
		$("#gePopUpLayer #shortcutId").focus();
	};
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
			addContent();
		}
	}
};

function shortcutFun () {
	//initial popup obj
	let shortcutPopUp = new GePopUp();
}

function addContent() {
	// console.log(shortcutUrl);
	// console.log($("#shortcutId").val());
	let obj = {
		id: $("#shortcutId").val(),
		url: shortcutUrl
	};
	console.log(obj);
	storage.get("shortcutSite",function (result) {
		result.shortcutSite.push(JSON.stringify(obj));
		console.log(result);
		storage.set(result);
	})
}
//————————————————————————————————my shortcut sites———————————————————————————————————