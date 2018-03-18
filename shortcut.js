console.log("shortcut.js");
chrome.storage.sync.get(function (response) {
	if(response.shortcut) shortcutFun();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log(request);
	if(request.filetype === "ge.shortcut"){
		request.pageUrl.replace(/\/\/(.*?)\//, function (match, p1) {
			$("#popUpLayer .top-title > span ").text(p1);
		});
		$("#popUpLayerMask").css("display","flex");
	};
});
//————————————————————————————————my shortcut sites———————————————————————————————————
function GePopUp () {
	this.ele =
	  $(`
		<div>
			<div class="popup-title-container">
				<div class="top-title">Add <span></span> to my shortcut site</div>
				<span id="popupCloseBtn" class="close"></span>
			</div>
			<div class="popup-content-container">
				<div class="content-label">Title</div>
				<input type="text">
			</div>
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
		$ele.on("click",function(e){
			e.stopPropagation();
		});
		$ele.on("click",this.domClick);
		$mask.append($ele);
		$("body").append($mask);
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