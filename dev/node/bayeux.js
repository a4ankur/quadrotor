
/*
PushTopic pushTopic = new PushTopic(
	Name                = 'CommandSetInserts',
	Query               = 'SELECT Id, Name, Body__c FROM CommandSet__c',
	ApiVersion          = 27.0,
	NotifyForOperations = 'Create',
	NotifyForFields     = 'Select'
);
insert pushTopic;
//faye.Logging.logLevel = 'debug';
//client.disable('websocket');
*/

var faye = require('./faye-node');

var client = new faye.Client('https://c.eu2.visual.force.com/cometd/27.0');
client.setHeader('Authorization', 'OAuth 00Db0000000K3WN!AQgAQFp9pihOoUb2om3WskHzy1efcGPV3i8tEZ_kZPxFJQqzPRg_DJNgJGdqPJ9XBW2Bgy3ahKADN.o_KDUlVvZIVwuLU3xO');

var subscription = client.subscribe('/topic/CommandSetInserts', function(message) {
	console.log('MSG: ' + message.sobject.Body__c);
});

subscription.errback(function(error) {
	console.log(error.message);
});
