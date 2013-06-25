
//Faye.Logging.logLevel = 'debug';
Faye.MANDATORY_CONNECTION_TYPES.push('cross-origin-long-polling'); //we need Faye to be AWARE of CORS transport, otherwise he will try and use JSONP
Faye.Transport.register('long-polling', Faye.Transport.CORS); //we need Faye to rename CORS as 'long-polling' not 'cross-origin-long-polling' otherwise SALESFORCE will complain there are no compatible transports

function Stream(instance, session) {
	this.client = new Faye.Client(instance + '/cometd/27.0');
	this.client.setHeader('Authorization', 'OAuth' + ' ' + session);
	this.client.setHeader('Content-Type', 'application/x-www-form-urlencoded');
}

Stream.prototype.subscribe = function(topicName, callback) {
	this.client.subscribe('/topic/' + topicName, function(response) {
		callback(response.sobject, response.event);
	});
};
