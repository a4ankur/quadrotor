
var faye = require('./faye-node');

console.log('derp derp');

var client = new faye.Client('https://c.eu2.visual.force.com/cometd/27.0');
client.setHeader('Authorization', 'OAuth 00Db0000000K3WN!AQgAQEtZcBZrGY5Tvz_VwZ_CcS7OmO5PiT78nnaI8DbfZoRvU63FlyOYXErwxR7bHOhQScunPL_KbRS7IQN2TM26Bvd5Cor8');

var subscription = client.subscribe('/topic/InvoiceStatementUpdates', function(message) {
	alert(message);
});

subscription.errback(function(error) {
	alert(error.message);
});
