
var buffer2string = function(buffer) {
	return String.fromCharCode.apply(null, new Uint8Array(buffer));
};

var string2buffer = function(string) {
	var buffer = new ArrayBuffer(string.length);
	var view = new Uint8Array(buffer);
	var chars = string.split('');
	chars.map(function(value, index, array) {
		view[index] = value.charCodeAt();
	});
	return buffer;
};

function Socket(callback) {
	var self = this;
	this.host = '';
	this.port = 0;
	this.info = {};
	chrome.socket.create('tcp', {}, function(socketInfo) {
		console.log('create', socketInfo.socketId);
		self.info = socketInfo;
		callback(socketInfo);
	});
}

Socket.prototype.connect = function(host, port, callback) {
	var self = this;
	this.host = host;
	this.port = parseInt(port);
	chrome.socket.connect(this.info.socketId, this.host, this.port, function(result) {
		console.log(self.host, self.port, 'connect', result);
		callback(result);
	})
};

Socket.prototype.write = function(data, callback) {
	var self = this;
	var buffer = string2buffer(data);
	chrome.socket.write(this.info.socketId, buffer, function(writeInfo) {
		console.log(self.host, self.port, 'write', data.replace(/[\r\n\t]+/g, ''));
		callback(writeInfo);
	});
};

Socket.prototype.read = function(callback) {
	var self = this;
	chrome.socket.read(this.info.socketId, function(readInfo) {
//		var data = buffer2string(readInfo.data);
		console.log(self.host, self.port, 'read', buffer2string(readInfo.data).replace(/[\r\n\t]+/g, ''));
		callback(readInfo);
	})
};

var cmdSock = new Socket(function() {
	cmdSock.connect('192.168.1.1', 21, function() {

		cmdSock.read(function(readInfo) {
			//220 Operation successful
		});

		cmdSock.write('PASV\r\n', function(writeInfo) {
			cmdSock.read(function(readInfo) {
				//227 PASV ok (192,168,1,1,129,178)
				var pasvs = buffer2string(readInfo.data).split('(')[1].split(')')[0].split(',').map(function(item) {return parseInt(item)});
				
				//33202
				var port = pasvs[5] + 256 * pasvs[4];
				
				var handleRead = function(readInfo) {
					if (!buffer2string(readInfo.data).length) return;
					console.log(buffer2string(readInfo.data).length);
					dataSock.read(handleRead);
				};
				
				var dataSock = new Socket(function() {
					dataSock.connect('192.168.1.1', port, function() {
						dataSock.read(handleRead);
					});
				});

				cmdSock.write('RETR boxes/flight_20130406_010025/picture_20130406_010025.jpg\r\n', function() {
					//
				});


				cmdSock.write('PASV\r\n', function() {});
				
			});
		});
	});
});



//var transmitPacket = function(host, port, data, callback) {
//	chrome.socket.create('tcp', {}, function(socketInfo) {
//		chrome.socket.connect(socketInfo.socketId, host, port, function() {
//			chrome.socket.write(socketInfo.socketId, string2buffer(data), function(writeInfo) {
//				chrome.socket.read(socketInfo.socketId, function(readInfo) {
//					callback(buffer2string(readInfo.data));
//				});
//			});
//		});
//	});
//};

//transmitPacket('192.168.1.1', 21, 'PASV\r\n', function() {
//	transmitPacket((arguments[0])
//});


//chrome.socket.create('tcp', {}, function(socketInfo) {
//	console.log(21, 'create');
//	
//	chrome.socket.connect(socketInfo.socketId, '192.168.1.1', 21, function() {
//		console.log(21, 'connect');
//		
//		chrome.socket.write(socketInfo.socketId, string2buffer('PASV\r\n'), function(writeInfo) {
//			console.log('PASV', writeInfo.bytesWritten);
//			
//			chrome.socket.read(socketInfo.socketId, function(readInfo) {
//				console.log(21, buffer2string(readInfo.data));
//
//				//220 Operation successful
//				//227 PASV ok (192,168,1,1,209,31)
//				var response = buffer2string(readInfo.data);
//				
//				//[192, 168, 1, 1, 209, 31]
//				var pasvs = response.split('(')[1].split(')')[0].split(',');
//				pasvs = pasvs.map(function(item) {return parseInt(item)});
//				
//				//53535
//				var port = pasvs[5] + 256 * pasvs[4];
//				
//				
//				chrome.socket.create('tcp', {}, function(socketInfo) {
//					chrome.socket.connect(socketInfo.socketId, '192.168.1.1', port, function() {
//						console.log(port, 'connect');
//						
//						chrome.socket.read(socketInfo.socketId, function(readInfo) {
//							console.log(port, buffer2string(readInfo.data));
//						});
//
//						chrome.socket.create('tcp', {}, function(socketInfo) {
//							chrome.socket.connect(socketInfo.socketId, '192.168.1.1', 21, function() {
//								console.log('connect');
//
//								chrome.socket.write(socketInfo.socketId, string2buffer('RETR boxes/flight_20130406_010025/picture_20130406_010025.jpg\r\n'), function() {
//									console.log('RETR');
//
//									chrome.socket.read(socketInfo.socketId, function(readInfo) {
//										console.log(21, buffer2string(readInfo.data));
//									})
//								});
//							});
//						});
//						
//					});
//				});
//				
//				
//				
//				
//			});
//		});
//
//	})
//});

