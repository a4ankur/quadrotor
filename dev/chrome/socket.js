
/**
 * Poor man's socket wrapper
 * 
 * @param callback
 * @constructor
 */
function Socket(callback, console) {
	var self = this;
	this.console = console;
	this.host  = '';
	this.port  = 0;
	this.info  = {};
	chrome.socket.create('tcp', {}, function(socketInfo) {
		self.console && self.console.log('[Socket]', 'create', socketInfo.socketId);
		self.info = socketInfo;
		callback && callback(socketInfo);
	});
}

/**
 * Connect interceptor
 * 
 * @param host
 * @param port
 * @param callback
 */
Socket.prototype.connect = function(host, port, callback) {
	var self = this;
	this.host = host;
	this.port = parseInt(port);
	chrome.socket.connect(this.info.socketId, this.host, this.port, function(result) {
		self.console && self.console.log('[Socket]', 'connect', self.host, self.port, result);
		callback && callback(result);
	})
};

/**
 * Write interceptor
 * 
 * @param string
 * @param callback
 */
Socket.prototype.write = function(string, callback) {
	var self = this;
	chrome.socket.write(this.info.socketId, Socket.string2buffer(string), function(writeInfo) {
		self.console && self.console.log('[Socket]', 'write', self.host, self.port, string.replace(/[\r\n\t]/g, '.'));
		callback && callback(writeInfo);
	});
};

/**
 * Read interceptor
 * 
 * @param callback
 */
Socket.prototype.read = function(callback) {
	var self = this;
	chrome.socket.read(this.info.socketId, function(readInfo) {
		var string = Socket.buffer2string(readInfo.data);
		self.console && self.console.log('[Socket]', 'read', self.host, self.port, string.replace(/[\r\n\t]/g, '.'));
		callback && callback(string);
	});
};

/**
 * Streamer
 * 
 * @param callback
 */
Socket.prototype.stream = function(callback) {
	var self = this;
	var blob = '';
	
	var handler = function(data) {
		if (!data.length) {
			//EOF
			callback && callback(blob);
		} else {
			blob += data;
			self.read(handler);
		}
	};
	
	this.read(handler);
};

/**
 * Convert ArrayBuffer to string
 * 
 * @param buffer
 * @return {Object}
 */
Socket.buffer2string = function(buffer) {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
};

/**
 * Convert string to ArrayBuffer
 * 
 * @param string
 * @return {ArrayBuffer}
 */
Socket.string2buffer = function(string) {
	var buffer = new ArrayBuffer(string.length);
	var view = new Uint8Array(buffer);
	var chars = string.split('');
	chars.map(function(value, index, array) {
		view[index] = value.charCodeAt();
	});
	return buffer;
};
