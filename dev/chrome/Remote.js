
function Remote(instance) {
	this.instance = instance;
	this.xhr = new XMLHttpRequest();
}

Remote.prototype.invoke = function(controller, method, data, callback) {
	var self = this;
	this.xhr.onreadystatechange = function() {
		if (self.xhr.readyState != 4) return; //nothing to do
		
		var response = JSON.parse(self.xhr.response);
		callback && callback(response[0].result, response[0]);
	};
	
	this.xhr.open('POST', this.instance + '/apexremote', true);
	this.xhr.setRequestHeader('Content-Type', 'application/json');
	var request = {
		action: controller,
		method: method,
		data  : data,
		ctx: {
			csrf : "",
			ns   : "",
			ver  : 27,
			vid  : "066000000000000" //empty visualforce page id
		},
		type: "rpc",
		tid: 0
	};
	this.xhr.send(JSON.stringify(request));
};