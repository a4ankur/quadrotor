/**
 * Poor man's FTP client
 * 
 * @param host
 * @param port
 * @param console
 * @constructor
 */
function Ftp(host, port, console) {
	this.console = console;
	this.host    = host;
	this.port    = parseInt(port);
}

/**
 * Convert passive response to port number
 * 
 * @param pasv
 * @return {Number}
 */
Ftp.pasv2port = function(pasv) {
	//227 PASV ok (192,168,1,1,129,178)
	var pasvs = pasv.match(/\d+/g); //["227", "192", "168", "1", "1", "129", "178"]
	return parseInt(pasvs[6]) + 256 * parseInt(pasvs[5]); //33202
};

/**
 * Download a file
 * 
 * @param path
 * @param callback
 */
Ftp.prototype.retrieve = function(path, eofHandler) {
	var self = this;
	var controlSocket, binarySocket; //commands usually 21, transfers usually > 1023
	//callback hell
	this.console && this.console.log('[Ftp]', 'retrieve', path);
	controlSocket = new Socket('tcp', function() {
		controlSocket.connect(self.host, self.port, function() {
			controlSocket.read(function(data) {
				controlSocket.write('PASV\r\n', function() {
					controlSocket.read(function(pasv) {
						binarySocket = new Socket('tcp', function() {
							binarySocket.connect(self.host, Ftp.pasv2port(pasv), function() {
								controlSocket.write('RETR ' + path + '\r\n', function() {
									binarySocket.stream(eofHandler);
									controlSocket.disconnect();
								});
							});
						}, self.console);
					});
				});
			});
		});
	}, self.console);
};

/**
 * Delete a file
 * 
 * @param path
 * @param callback
 */
Ftp.prototype.deleteFile = function(path, callback) {
	var self = this;
	var controlSocket;
	this.console && this.console.log('[Ftp]', 'delete', path);
	controlSocket = new Socket('tcp', function() {
		controlSocket.connect(self.host, self.port, function() {
			controlSocket.read(function() {
				controlSocket.write('DELE ' + path + '\r\n', function() {
					controlSocket.read(function() {
						controlSocket.disconnect();
						callback && callback();
					});
				});
			});
		});
	}, self.console);
};

/**
 * Remove a directory
 * 
 * @param path
 * @param callback
 */
Ftp.prototype.removeDirectory = function(path, callback) {
	var self = this;
	var controlSocket;
	this.console && this.console.log('[Ftp]', 'removeDirectory', path);
	controlSocket = new Socket('tcp', function() {
		controlSocket.connect(self.host, self.port, function() {
			controlSocket.read(function() {
				controlSocket.write('RMD ' + path + '\r\n', function() {
					controlSocket.read(function() {
						controlSocket.disconnect();
						callback && callback();
					});
				});
			});
		});
	}, self.console);
};

Ftp.prototype.listDirectory = function(path, callback) {
	var self = this;
	var controlSocket, binarySocket; //commands usually 21, transfers usually > 1023
	//callback hell
	this.console && this.console.log('[Ftp]', 'listDirectory', path);
	controlSocket = new Socket('tcp', function() {
		controlSocket.connect(self.host, self.port, function() {
			controlSocket.read(function(data) {
				controlSocket.write('PASV\r\n', function() {
					controlSocket.read(function(pasv) {
						binarySocket = new Socket('tcp', function() {
							binarySocket.connect(self.host, Ftp.pasv2port(pasv), function() {
								controlSocket.write('LIST ' + path + '\r\n', function() {
									binarySocket.stream(callback);
									controlSocket.disconnect();
								});
							});
						}, self.console);
					});
				});
			});
		});
	}, self.console);
};
