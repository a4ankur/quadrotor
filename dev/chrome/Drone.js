
function Drone(host, console) {
	this.console = console;
	this.host    = host;
	this.port    = 5556;
}

Drone.prototype.handshake = function(callback) {
	var self = this;
	var commandSocket;
	var data = 'PARROT AUTH';
	//port 5552
	this.console && this.console.log('[Drone]', 'sayHello', data);
	commandSocket = new Socket('udp', function() {
		commandSocket.connect(self.host, 5552, function() {
			commandSocket.write('PARROT AUTH', function() {
				commandSocket.read(function(data) {
					callback && callback(data);
				});
			});
		});
	}, console);
};

Drone.prototype.transmitDatagram = function(command) {
	var self = this;
	var commandSocket;
	//port 5556
	this.console && this.console.log('[Drone]', 'transmitDatagram', self.host, self.port, command.replace(/[\r\n\t]/g, '.'));
	commandSocket = new Socket('udp', function() {
		commandSocket.connect(self.host, self.port, function() {
			commandSocket.write(command, function() {
				commandSocket.read();
			});
		});
	});
};

