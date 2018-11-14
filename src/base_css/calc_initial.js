var tags = [
	"a",
	"abbr",
	"address",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"bdi",
	"bdo",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"cite",
	"code",
	"col",
	"colgroup",
	"data",
	"datalist",
	"dd",
	"del",
	"details",
	"dfn",
	"dialog",
	"div",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldset",
	"figcaption",
	"figure",
	"footer",
	"form",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"head",
	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"kbd",
	"keygen",
	"label",
	"legend",
	"li",
	"link",
	"main",
	"map",
	"mark",
	"math",
	"menu",
	"menuitem",
	"meta",
	"meter",
	"nav",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"picture",
	"pre",
	"progress",
	"q",
	"rb",
	"rp",
	"rt",
	"rtc",
	"ruby",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"slot",
	"small",
	"source",
	"span",
	"strong",
	"style",
	"sub",
	"summary",
	"sup",
	"svg",
	"table",
	"tbody",
	"td",
	"template",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"track",
	"u",
	"ul",
	"var",
	"video",
	"wbr"
];

var initialStyles = {}

tags.forEach(tag => {
	let elem = document.createElement(tag);
	document.body.appendChild(elem);
	elem.style.display = 'none'
	//let unsetStyle = window.getComputedStyle(elem);
	// for (let i = 0; i < unsetStyle.length; i++) {
	// 	let property = unsetStyle.item(i);
	// 	elem.style[property] = "initial";
  //   }
	let initialStyle = window.getComputedStyle(elem);
	let initial = {}
	for (let i = 0; i < initialStyle.length; i++) {
		let property = initialStyle.item(i);
		initial[property] = initialStyle.getPropertyValue(property);
    }
	initialStyles[tag] = initial;
})

let elem = document.createElement("div");
document.body.appendChild(elem);
elem.style.display = 'none'
let initialStyle = window.getComputedStyle(elem, "::before");
let initial = {}
for (let i = 0; i < initialStyle.length; i++) {
	let property = initialStyle.item(i);
	initial[property] = initialStyle.getPropertyValue(property);
	}
initialStyles["::before"] = initial;

initialStyle = window.getComputedStyle(elem, "::after");
initial = {}
for (let i = 0; i < initialStyle.length; i++) {
	let property = initialStyle.item(i);
	initial[property] = initialStyle.getPropertyValue(property);
	}
initialStyles["::after"] = initial;

copy(JSON.stringify(initialStyles, null, 2));
