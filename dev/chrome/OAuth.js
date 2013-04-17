
function OAuth(username, password, security) {
	this.xhr = new XMLHttpRequest();
	this.username = username;
	this.password = password;
	this.security = security;
	
	this.response = {
		access_token : '', //eg 00Db0000000K3WN!AQgAQIREObEmJRPUrcMflX8MHr339DH0JzD3tpPXX_.79oKUhErmlO3f27n0JOhaE0fnBW827qGGSPD7a.ZMxqgApMsPKgDb
		id           : '', //eg https://login.salesforce.com/id/00Db0000000K3WNEA0/005b0000000hK9eAAE
		instance_url : '', //eg https://eu2.salesforce.com
		issued_at    : '', //eg 1366154706945
		signature    : ''  //eg 1234567890cqnL8rMv9HQX7zfdo3H3Mim1234567890=
	};
}

OAuth.prototype.login = function(callback) {
	var self = this;
	this.xhr.onreadystatechange = function() {
		if (self.xhr.readyState != 4) return; //nothing to do
		
		self.response = JSON.parse(self.xhr.response);
		callback && callback(self.response);
	};
	
	this.xhr.open('POST', 'https://login.salesforce.com/services/oauth2/token', true);
	this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	this.xhr.send([
		'grant_type'    + '=' + 'password',
		'client_id'     + '=' + '3MVG99qusVZJwhsmj9swFUL3kw_wkILexqNpf80RYxI1KmHJ6tA6mvnYEUBKlHPt_tKm49Fb7CnUYLDV.JK75',
		'client_secret' + '=' + '403731136750814498',
		'username'      + '=' + encodeURIComponent(this.username),
		'password'      + '=' + encodeURIComponent(this.password) + encodeURIComponent(this.security)
	].join('&'));
};
