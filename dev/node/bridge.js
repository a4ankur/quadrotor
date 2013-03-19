
var
	faye   = require('./faye-node'),
	Buffer = require('buffer').Buffer,
	dgram = require('dgram'),
	socket = dgram.createSocket('udp4')
;

function transmitDatagram(host, port, data) {
	var buffer = new Buffer(data);
	socket.sendto(
		buffer,
		0,
		buffer.length,
		port,
		host
	);
}

var client = new faye.Client('https://c.eu2.visual.force.com/cometd/27.0');
client.setHeader('Authorization', 'OAuth 00Db0000000K3WN!AQgAQPQLHLIjzUa45hquXrMATSBQ_za2PsySpPvaaIoY2waJgdnmBqaqFv4HzaXDFqvocoAHhuj8LtmAW9c7BUdbfWSun1S8');

//var i = 0;

var subscription = client.subscribe('/topic/CommandSetInserts', function(message) {
	console.log('CMD: ' + message.sobject.Body__c);
	setTimeout(function() {transmitDatagram('192.168.1.1', 5552, 'PARROT AUTH');}, 100);
	setTimeout(function() {transmitDatagram('192.168.1.1', 5556, message.sobject.Body__c + "\r");}, 500);
});

subscription.errback(function(error) {
	console.log(error.message);
});
