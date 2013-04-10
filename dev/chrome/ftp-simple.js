

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



//commands on 21 and transfers on > 1023
var host = '192.168.1.1';
var port = 21;
var controlSocket, binarySocket;
var eofHandler = function(blob) {
	var img = document.getElementById('image');
	img.src = 'data:image/jpeg;base64,' + btoa(blob);
};

//download callback hell
controlSocket = new Socket(function() {
	controlSocket.connect(host, port, function() {
		controlSocket.read(function(data) {
			controlSocket.write('PASV\r\n', function() {
				controlSocket.read(function(pasv) {
					binarySocket = new Socket(function() {
						binarySocket.connect(host, pasv2port(pasv), function() {
							controlSocket.write('RETR boxes/flight_20130406_010025/picture_20130406_010025.jpg\r\n');
							binarySocket.stream(eofHandler);
						});
					}, true);
				});
			});
		});
	});
}, true);
