// ==UserScript==
// @name						Hulu Lightbox
// @description			Adds a lightbox effect to the hulu page, when you open a
// 									video from your queue as a pop out
// @include					*hulu.com/profile/queue*
// ==/UserScript

// sets up the overlay element 
function SetupOverlay(thisBody) {
	
	var overlay = document.getElementById('overlay-QskLSP');
	
	if (overlay == null ){
		var myDiv = document.createElement('div');
		var style = "display:none;z-index:1001;background-color:black;opacity:.80;position:fixed;width:100%;height:100%;overflow:auto";
		myDiv.setAttribute("style", style);
		myDiv.id = "overlay-QskLSP";
	
		myDiv.onclick = function() {
			return function() {
				ToggleOverlay(myDiv);
			};
		}(myDiv);
		
		thisBody.insertBefore(myDiv,thisBody.firstChild);
		overlay = myDiv
	}
	
	return overlay;
}

function ToggleOverlay(thisOverlay) {

	if (thisOverlay.style.display != 'block'){
		thisOverlay.style.display='block';
	}else{
		thisOverlay.style.display='none';
	}

}

/// BEGIN Lightbox Function
function LightBox(overlay_ele, popout_link) {
	//toggle the overlay
	ToggleOverlay(overlay_ele);

	// execute pop out function
	location.assign( "javascript:"+popout_link+";void(0)");
}
// END Lightbox Function

// -- Begin Script --

var body = document.getElementsByTagName('body')[0];

var myOverlay = SetupOverlay(body);

// Find the popout links.  They are located in a cell labeled c6 in the html
// for the queue page.
allPopOuts = document.evaluate( 
	"//td[@class='c5']/a[contains(@onclick, 'popOutWithCid')]", // all the anchors with an href that are children of a td of class:c6
	document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

for (var i = 0; i < allPopOuts.snapshotLength; i++) {
	var thisLink = allPopOuts.snapshotItem(i);

	// Grab the onclick function call, from the page, so that we can pass it to 
	// our variable for execution after starting the lightbox. 
	var popOutLink = thisLink.getAttribute('onclick');
	
	// here to check the function that's suppose to be called.
	thisLink.firstChild.setAttribute('title', popOutLink); 

	// set the new event handler for when the link is clicked.
	thisLink.onclick = function(myOverlay, popOutLink) {
		return function(){
			LightBox(myOverlay, popOutLink);
		};
	}(myOverlay, popOutLink);

}

// DONE
