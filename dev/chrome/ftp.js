
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
	var port = parseInt(pasvs[6]) + 256 * parseInt(pasvs[5]); //33202
	return port;
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
	this.console && console.log('[Ftp]', 'retrieve', path);
	controlSocket = new Socket(function() {
		controlSocket.connect(self.host, self.port, function() {
			controlSocket.read(function(data) {
				controlSocket.write('PASV\r\n', function() {
					controlSocket.read(function(pasv) {
						binarySocket = new Socket(function() {
							binarySocket.connect(self.host, Ftp.pasv2port(pasv), function() {
								controlSocket.write('RETR ' + path + '\r\n');
								binarySocket.stream(eofHandler);
							});
						}, self.console);
					});
				});
			});
		});
	}, self.console);
};

Ftp.prototype.delete = function(path, callback) {
	var self = this;
	var controlSocket, binarySocket;
	this.console && console.log('[Ftp]', 'delete', path);
	controlSocket = new Socket(function() {
		controlSocket.connect(self.host, self.port, function() {
			controlSocket.read(function(data) {
				controlSocket.write('DELE ' + path + '\r\n', function() {
					controlSocket.read(function(operation) {
						//console.log(operation);
						callback && callback();
					});
				});
			});
		});
	}, self.console);
};

Ftp.prototype.removeDirectory = function(path, callback) {
	var self = this;
	var controlSocket, binarySocket;
	this.console && console.log('[Ftp]', 'removeDirectory', path);
	controlSocket = new Socket(function() {
		controlSocket.connect(self.host, self.port, function() {
			controlSocket.read(function(data) {
				controlSocket.write('RMD ' + path + '\r\n', function() {
					controlSocket.read(function(operation) {
						//console.log(operation);
						callback && callback();
					});
				});
			});
		});
	}, self.console);
};

