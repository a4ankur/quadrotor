
function OAuth(client, secret) {
	this._client = client;
	this._secret = secret;
	
	this.response = {
		access_token : '', //eg 00Db0000000K3WN!AQgAQIREObEmJRPUrcMflX8MHr339DH0JzD3tpPXX_.79oKUhErmlO3f27n0JOhaE0fnBW827qGGSPD7a.ZMxqgApMsPKgDb
		id           : '', //eg https://login.salesforce.com/id/00Db0000000K3WNEA0/005b0000000hK9eAAE
		instance_url : '', //eg https://eu2.salesforce.com
		issued_at    : '', //eg 1366154706945
		signature    : ''  //eg 1234567890cqnL8rMv9HQX7zfdo3H3Mim1234567890=
	};
}

OAuth.prototype.login = function(username, password, security, callback) {
	var self = this;
	var xhr = new XMLHttpRequest();
	
	xhr.open('POST', 'https://login.salesforce.com/services/oauth2/token', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = handler;
	xhr.send([
		'grant_type'    + '=' + 'password',
		'client_id'     + '=' + this._client,
		'client_secret' + '=' + this._secret,
		'username'      + '=' + encodeURIComponent(username),
		'password'      + '=' + encodeURIComponent(password) + encodeURIComponent(security)
	].join('&'));
	
	function handler() {
		if (xhr.readyState != 4) return; //nothing to do
		self.response = JSON.parse(xhr.response);
		callback && callback(self.response);
	}
};
