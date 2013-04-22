
var flightName = 'F-7';
var sequence = 0;

var handshakeInterval = 0;
var handshakePoller = function() {
	
	var drone = new Drone('192.168.1.1', console);
	drone.handshake(function(handshake) {
		
		//PARROT OK, clean up interval
		console.log('successful handshake', handshake);
		clearInterval(handshakeInterval);
		document.getElementById('DroneIndicator').style.background = 'green';
		
		//use remoting client to obtain new flight id
		var manager = new Manager('https://droneforce-developer-edition.eu2.force.com');
		manager.invoke('FlightRemoteController', 'createFlight', [], function(flight) {
			
			//we must authenticate in order to use the Streaming API
			var oauth = new OAuth('3MVG99qusVZJwhsmj9swFUL3kw_wkILexqNpf80RYxI1KmHJ6tA6mvnYEUBKlHPt_tKm49Fb7CnUYLDV.JK75', '403731136750814498');
			oauth.login('matt@20demo.com', 'rs42lkj1', 'qLsXOKlNMaOLANXUISU5nC73', function(payload) {
				
				//streaming topic is flight name
				document.getElementById('StreamIndicator').style.background = 'green';
				var stream = new Stream(payload.instance_url, payload.access_token);
				stream.subscribe(flight.Name, function(command, event) {
					
					//forward commands to the quadrotor
					drone.transmitDatagram(command.Body__c + '\r');
					document.getElementById('CommandsIndicator').style.background = 'green';
				});
				
			});
			
		});
		
	});
};

handshakeInterval = setInterval(handshakePoller, 1000);
