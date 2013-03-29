
var Buffer = require('buffer').Buffer;
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

var transmitDatagram = function(host, port, data) {
	var buffer = new Buffer(data);
	socket.sendto(
		buffer,
		0,
		buffer.length,
		port,
		host
	);
};

var interval;

//handshake
console.log('PARROT AUTH');
transmitDatagram('192.168.1.1', 5552, 'PARROT AUTH');

//commands
var intervalHandler = function() {
	var command = commands.shift();
	if (!command) process.exit();
	console.log(command);
	transmitDatagram('192.168.1.1', 5556, command + "\r");
};

interval = setInterval(intervalHandler, 500);

var commands = [
	'AT*REF=1,290717696',
	'AT*REF=2,290717696',
	'AT*REF=3,290717696',
	'AT*REF=4,290717696',
	'AT*REF=5,290717696'
];