"use strict";

//storage items which need bind event & method
const pairs = [
  {
    keyValue: "dblclickToTop",
    event: "dblclick.ge",
    method: dblclickToTopFun,
  },
  {
    keyValue: "flipPage",
    event: "keyup.ge",
    method: flipPageFun,
  },
];

//ajax get via promise
function getURL(url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.statusText));
      }
    };
    xhr.onerror = function () {
      reject(new Error(xhr.statusText));
    };
    xhr.send();
  });
}

function bindEvent(key) {
  let result = searchPair(key);
  $("body").on(result.event, result.method);
}

// associate key with function
const rules = {
  dblclickToTop: function (key, value) {
    if (value) bindEvent(key); //if value == 1,add event
  },
  flipPage: function (key, value) {
    if (value) bindEvent(key);
  },
  newTab: function (key, value) {
    newTabFun(value);
  },
  endless: function (key, value) {
    if (value) endlessFun();
  },
  nightMode: function (key, value) {
    if (value) nightModeFun();
  },
  cardStyle: function (key, value) {
    if (value) cardStyleFun();
  },
  areaClick: function (key, value) {
    if (value) areaClickFun();
  },
};

//find the same keyvalue as input value
function searchPair(key) {
  return pairs.find((ele) => ele.keyValue == key);
}

//initial
function initial(key, value) {
  if (typeof rules[key] === "undefined") return;
  if (
    ["dblclickToTop", "flipPage", "newTab", "endless", "areaClick"].includes(
      key
    )
  ) {
    $(function () {
      rules[key](key, value);
    });
  } else {
    rules[key](key, value);
  }
}

//initial function when page load
chrome.storage.sync.get(function (response) {
  let keys = Object.keys(response);
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];
    let value = response[key];
    initial(key, value);
  }
  kwColorAll(response);
  setVLinkColor(response);
});

//——————————————————————————————————Double click back to top——————————————————————————
function dblclickToTopFun() {
  let selObj = window.getSelection();
  if (selObj.focusNode.className === "a4bIc") return; // search input
  window.getSelection().removeAllRanges(); //prevent conflict with dblclick select words
  $("html, body").animate({ scrollTop: 0 }, 300);
}
//——————————————————————————————————Double click back to top——————————————————————————

//——————————————————————————————————use arrow keys to flip pages——————————————————————
function flipPageFun(e) {
  if ($("textarea").is(":focus") || $("input").is(":focus")) return;

  if (e.keyCode == 37) {
    // Press left key, previous page
    if (!$("#pnprev")[0]) {
      alert(chrome.i18n.getMessage("flipPageToFirst"));
      return;
    } else {
      $("#pnprev")[0].click();
    }
  } else if (e.keyCode == 39) {
    // Press right right, next page
    if (!$("#pnnext")[0]) {
      alert(chrome.i18n.getMessage("flipPageToLast"));
      return;
    } else {
      $("#pnnext")[0].click();
    }
  }
}
//——————————————————————————————————use arrow keys to flip pages——————————————————————

//——————————————————————————————————open link in new tab——————————————————————————————
function newTabFun(value) {
  let $links = $(`
		#tads a,
		#res a,
		#rhs a,
		#bottomads a,
		#extrares a,
        .card-section a
`);
  $links.attr("target", value ? "_blank" : "");
}
//——————————————————————————————————open link in new tab——————————————————————————————

//——————————————————————————————————endless google————————————————————————————————————
/*
 * refer to Endless Google
 * @author tumpio
 * @link: https://openuserjs.org/scripts/tumpio/Endless_Google
 * @version 0.0.6
 * and made some changes
 */

function endlessFun() {
  if (location.href.indexOf("tbm=isch") !== -1) return;
  if (window.top !== window.self) return;

  const centerElement = "#center_col";
  const loadWindowSize = 1.6;
  const filtersAll = ["#foot", "#bottomads"];
  const filtersCol = filtersAll.concat(["#extrares", "#imagebox_bigimages"]);
  let msg = "";

  const css = `
.page-number {
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
	margin-bottom: 2em;
	color: #808080;
}
.page-number::before {
  content: "";
  background-color: #ededed;
  height: 1px;
  width: 100%;
  margin: 1em 3em;
}
.endless-msg {
  position:fixed;
  bottom:0;
  left:0;
  padding:5px 10px;
  background: darkred;
  color: white;
  font-size: 11px;
  display: none;
}
.endless-msg.shown {
  display:block;
}
`;

  $(window).on("beforeunload.ge", function () {
    window.scrollTo(0, 0);
  });

  let pageNumber = 1;
  let prevScrollY = 0;
  let nextPageLoading = false;

  init();

  function requestNextPage() {
    nextPageLoading = true;
    let nextPage = new URL(location.href);
    if (!nextPage.searchParams.has("q")) return;

    nextPage.searchParams.set("start", String(pageNumber * 10));
    !msg.classList.contains("shown") && msg.classList.add("shown");
    fetch(nextPage.href)
      .then((response) => response.text())
      .then((text) => {
        let parser = new DOMParser();
        let htmlDocument = parser.parseFromString(text, "text/html");
        let content = htmlDocument.documentElement.querySelector(centerElement);

        content.id = "col_" + pageNumber;
        filter(content, filtersCol);

        let pageMarker = document.createElement("div");
        pageMarker.textContent = String(pageNumber + 1);
        pageMarker.className = "page-number";

        let col = document.createElement("div");
        col.className = "next-col";
        col.appendChild(pageMarker);

        //if open in newTab enabled
        chrome.storage.sync.get(["newTab"], function (result) {
          const value = result["newTab"];
          $(content)
            .find(
              `#tads a, #res a, #rhs a, #bottomads a, #extrares a, .card-section a
`
            )
            .attr("target", value ? "_blank" : "");
        });

        col.appendChild(content);
        document.querySelector(centerElement).appendChild(col);

        if (!content.querySelector("#rso")) {
          // end of results
          window.removeEventListener("scroll", onScrollDocumentEnd);
          nextPageLoading = false;
          msg.classList.contains("shown") && msg.classList.remove("shown");
          return;
        }

        pageNumber++;
        nextPageLoading = false;
        msg.classList.contains("shown") && msg.classList.remove("shown");
      });
  }

  function onScrollDocumentEnd() {
    let y = window.scrollY;
    let delta = y - prevScrollY;
    if (!nextPageLoading && delta > 0 && isDocumentEnd(y)) {
      requestNextPage();
    }
    prevScrollY = y;
  }

  function isDocumentEnd(y) {
    return (
      y + window.innerHeight * loadWindowSize >= document.body.clientHeight
    );
  }

  function filter(node, filters) {
    for (let filter of filters) {
      let child = node.querySelector(filter);
      if (child) {
        child.parentNode.removeChild(child);
      }
    }
  }

  function init() {
    prevScrollY = window.scrollY;
    window.addEventListener("scroll", onScrollDocumentEnd);
    filter(document, filtersAll);
    let style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    msg = document.createElement("div");
    msg.setAttribute("class", "endless-msg");
    msg.innerText = chrome.i18n.getMessage("endlessLoadingHint");
    document.body.appendChild(msg);
  }
}
//——————————————————————————————————endless google————————————————————————————————————

//————————————————————————set keywords color & bgcolor & opacity——————————————————————
let _kwColor, _bgColor;

function kwColorAll(response) {
  let r = parseInt(response.kwBgColor.substring(1, 3), 16);
  let g = parseInt(response.kwBgColor.substring(3, 5), 16);
  let b = parseInt(response.kwBgColor.substring(5, 7), 16);
  _bgColor = `${r},${g},${b},${response.kwOpacity}`;
  _kwColor = response.kwColor;
  $(function () {
    $("em").css({
      color: _kwColor,
      backgroundColor: `rgba(${_bgColor})`,
    });
  });
}
//————————————————————————set keywords color & bgcolor & opacity——————————————————————

//————————————————————————set visited link color——————————————————————
function setVLinkColor(response) {
  const cssString = `a:visited{color: ${response.vLinkColor} !important}`;
  const styleTag = document.createElement("style");
  styleTag.innerHTML = cssString;
  document.head.insertAdjacentElement("beforeend", styleTag);
}
//————————————————————————set visited link color——————————————————————

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.filetype.indexOf("timeRangeSearch") !== -1)
    timeRangeSearchFun(request);
});

//————————————————————————————————time range search———————————————————————————————————
function timeRangeSearchFun(request) {
  let key = Object.keys(request)[0];
  let id = request[key].slice(19);
  if (id == "cdr_opt") {
    //custom range ...
    $("#cdr_opt span")[0].click();
  } else {
    $("#" + id + " > a")[0].click();
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
  if (window.location.href.search("tbm=isch") == -1) {
    $("head").append(link);
  }
}
//————————————————————————————————card style UI———————————————————————————————————————

//————————————————————————————————area click——————————————————————————————————————————
function areaClickFun() {
  $(".g")
    .hover(
      function () {
        $(this).css({
          cursor: "pointer",
        });
      },
      function () {
        $(this).css({
          cursor: "auto",
        });
      }
    )
    .on("mousedown", function (e) {
      if (e.which === 2) {
        const link = $(this).find(".r a")[0];
        const href = link.href;
        const target = $(link).attr("target");
        target === "_blank" ? window.open(href) : (window.location.href = href);
      }
    });
}
//————————————————————————————————area click——————————————————————————————————————————
