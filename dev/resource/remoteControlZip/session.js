
var flightId;
var consoleElement;

var init = function() {
	flightId = window.location.href.split('?id=').pop();
	consoleElement = document.getElementById($Component.consoleId);
};

var handleLaunch = function(commandSet) {
	init();
	consoleElement.innerHTML = commandSet.Body__c + '\n' + consoleElement.innerHTML;
};

var handleFlip = function(commandSet) {
	init();
	consoleElement.innerHTML = commandSet.Body__c + '\n' + consoleElement.innerHTML;
};

var handleLand = function(commandSet) {
	init();
	consoleElement.innerHTML = commandSet.Body__c + '\n' + consoleElement.innerHTML;
};

