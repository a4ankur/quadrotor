
//alert($Api.Session_ID);

//we used eu2.salesforce.com and it tried to use JSONP as transport
//change to same-origin VF url and it's good.

var client = new Faye.Client('https://c.eu2.visual.force.com/cometd/27.0');
client.setHeader('Authorization', 'OAuth ' + $Api.Session_ID);

var subscription = client.subscribe('/topic/InvoiceStatementUpdates', function(message) {
	alert(message);
});

subscription.errback(function(error) {
	alert(error.message);
});

