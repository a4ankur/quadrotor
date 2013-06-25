var eofHandler = function(blob) {
	var img = document.getElementById('image');
	img.src = 'data:image/jpeg;base64,' + btoa(blob);
};

var client = new Ftp('192.168.1.1', 21, console);
client.retrieve('/boxes/flight_20130406_010025/picture_20130406_010025.jpg', eofHandler);

client.deleteFile('/boxes/flight_20130406_010025/picture_20130406_010025.jpg', function() {
	client.removeDirectory('/boxes/flight_20130406_010025', function() {
		//
	});
});
