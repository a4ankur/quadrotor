
var transmitDatagram = function(host, port, data) {
	chrome.socket.create('udp', {}, function(socketInfo) {
		chrome.socket.connect(socketInfo.socketId, host, port, function() {
			var buffer = string2buffer(data);
			//var view = new Uint8Array(buffer);
			//console.log(view);
			chrome.socket.write(socketInfo.socketId, buffer, function() {});
		});
	});
};

function UdpSocket(callback, console) {
	var self = this;
	this.console = console;
	this.host = '';
	this.port = 0;
	this.info = {};
	chrome.socket.create('udp', {}, function(socketInfo) {
		self.console && self.console.log('[UdpSocket]', 'create', socketInfo.socketId);
		self.info = socketInfo;
		callback && callback(socketInfo);
	});
}

UdpSocket.prototype.connect = function(host, port, callback) {
	var self = this;
	this.host = host;
	this.port = port;
	chrome.socket.connect(this.info.socketId, this.host, this.port, function(result) {
		self.console && self.console.log('[UdpSocket]', 'connect', result);
		callback && callback(result);
	});
};

UdpSocket.prototype.write = function(string, callback) {
	var self = this;
	chrome.socket.write(this.info.socketId, UdpSocket.string2buffer(string), function(writeInfo) {
		self.console && self.console.log('[UdpSocket]', 'write', self.host, self.port, string.replace(/[\r\n\t]/g, '.'));
		callback && callback(writeInfo);
	})
};

UdpSocket.prototype.read = function(callback) {
	var self = this;
	chrome.socket.read(this.info.socketId, function(readInfo) {
		var string = UdpSocket.buffer2string(readInfo.data);
		self.console && self.console.log('[UdpSocket]', 'read', self.host, self.port, string.replace(/[\r\n\t]/g, '.'));
		callback && callback(string);
	});
};

/**
 * Convert ArrayBuffer to string
 *
 * @param buffer
 * @return {Object}
 */
UdpSocket.buffer2string = function(buffer) {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
};

/**
 * Convert string to ArrayBuffer
 *
 * @param string
 * @return {ArrayBuffer}
 */
UdpSocket.string2buffer = function(string) {
	var buffer = new ArrayBuffer(string.length);
	var view = new Uint8Array(buffer);
	var chars = string.split('');
	chars.map(function(value, index, array) {
		view[index] = value.charCodeAt();
	});
	return buffer;
};
