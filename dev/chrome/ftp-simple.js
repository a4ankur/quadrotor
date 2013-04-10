
/**
 * Convert ArrayBuffer to string
 * @param buffer
 * @return {Object}
 */
var buffer2string = function(buffer) {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
};

/**
 * Convert passive response to port number
 * @param pasv
 * @return {Number}
 */
var pasv2port = function(pasv) {
	//227 PASV ok (192,168,1,1,129,178)
	var pasvs = pasv.match(/\d+/g); //["227", "192", "168", "1", "1", "129", "178"]
	var port = parseInt(pasvs[6]) + 256 * parseInt(pasvs[5]); //33202
	return port;
};

/**
 * Convert string to ArrayBuffer
 * @param string
 * @return {ArrayBuffer}
 */
var string2buffer = function(string) {
	var buffer = new ArrayBuffer(string.length);
	var view = new Uint8Array(buffer);
	var chars = string.split('');
	chars.map(function(value, index, array) {
		view[index] = value.charCodeAt();
	});
	return buffer;
};

/**
 * Poor man's socket wrapper
 * @param callback
 * @constructor
 */
function Socket(callback) {
	var self = this;
	this.host = '';
	this.port = 0;
	this.info = {};
	chrome.socket.create('tcp', {}, function(socketInfo) {
		console.log('create', socketInfo.socketId);
		self.info = socketInfo;
		callback && callback(socketInfo);
	});
}

/**
 * Connect interceptor
 * @param host
 * @param port
 * @param callback
 */
Socket.prototype.connect = function(host, port, callback) {
	var self = this;
	this.host = host;
	this.port = parseInt(port);
	chrome.socket.connect(this.info.socketId, this.host, this.port, function(result) {
		console.log(self.host, self.port, 'connect', result);
		callback && callback(result);
	})
};

/**
 * Write interceptor
 * @param string
 * @param callback
 */
Socket.prototype.write = function(string, callback) {
	var self = this;
	chrome.socket.write(this.info.socketId, string2buffer(string), function(writeInfo) {
		console.log(self.host, self.port, 'write', string.replace(/[\r\n\t]/g, '.'));
		callback && callback(writeInfo);
	});
};

/**
 * Read interceptor
 * @param callback
 */
Socket.prototype.read = function(callback) {
	var self = this;
	chrome.socket.read(this.info.socketId, function(readInfo) {
		var string = buffer2string(readInfo.data);
		console.log(self.host, self.port, 'read', string.replace(/[\r\n\t]/g, '.'));
		callback && callback(string);
	});
};

/**
 * Streamer
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

//control on 21 and data on > 1023
var host = '192.168.1.1';
var port = 21;
var binarySocket, controlSocket;
var eofHandler = function(blob) {
	var img = document.getElementById('image');
	img.src = 'data:image/jpeg;base64,' + btoa(blob);
};

//poor man's callback hell
controlSocket = new Socket(function() {
	controlSocket.connect(host, port, function() {
		controlSocket.read(function(data) {
			controlSocket.write('PASV\r\n', function(data) {
				controlSocket.read(function(data) {
					binarySocket = new Socket(function() {
						binarySocket.connect(host, pasv2port(data), function() {
							controlSocket.write('RETR boxes/flight_20130406_010025/picture_20130406_010025.jpg\r\n');
							binarySocket.stream(eofHandler);
						});
					});
				});
			});
		});
	});
});
