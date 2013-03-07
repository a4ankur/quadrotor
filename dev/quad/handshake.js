
var Buffer = require('buffer').Buffer;
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

var command = 'PARROT AUTH';
var buffer = new Buffer(command);

socket.sendto(
	buffer,
	0,
	buffer.length,
	5552,
	'192.168.1.1'
);

