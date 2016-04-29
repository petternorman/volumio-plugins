'use strict';

var libQ = require('kew');
var libNet = require('net');
var libFast = require('fast.js');
var libLevel = require('level');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var nodetools = require('nodetools');
var telnet = require('telnet-client');
var connection = new telnet();

// Define the ControllerBrutefirplug class
module.exports = ControllerBrutefirplug;
function ControllerBrutefirplug(context) {
	// This fixed variable will let us refer to 'this' object at deeper scopes
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;
}


ControllerBrutefirplug.prototype.getConfigurationFiles = function()
{
	var self = this;

	return ['config.json'];
}

ControllerBrutefirplug.prototype.addToBrowseSources = function () {
	var self = this;
	var data = {name: 'Brutefir', uri: 'Brutefir',plugin_type:'miscellanea',plugin_name:'brutefir'};
	self.commandRouter.volumioAddToBrowseSources(data);
};

// Plugin methods -----------------------------------------------------------------------------
ControllerBrutefireplug.prototype.onVolumioStart = function() {
	var self = this;

	var configFile=self.commandRouter.pluginManager.getConfigurationFile(self.context,'config.json');
	self.config = new (require('v-conf'))();
	self.config.loadFile(configFile);

	self.startBrutefireplugDaemon();
	setTimeout(function () {
	self.BrutefireplugDaemonConnect();
	}, 5000);



};

ControllerBrutefireplug.prototype.startBrutefireplugDaemon = function() {
	var self = this;
	exec("brutefir", function (error, stdout, stderr) {
		if (error !== null) {
			self.commandRouter.pushConsoleMessage('The following error occurred while starting Brutefirplug: ' + error);
		}
		else {
			self.commandRouter.pushConsoleMessage('Brutefir Daemon Started');
		}
	});
};


	// Here we send the command to brutfir via telnet
	var setting = self.config.get('coef315','coef63.5','coef125','coef250','coef500','coef1000','coef2000','coef4000','coef8000','coef16000');

	var params = {
	host: 'localhost',
	port: 3002,
	shellPrompt: '/ # ',
	timeout: 1500,
	// removeEcho: 4
	};

	//here we compose the eq cmd
	var cmd = 'lmc eq 0 mag 31.5/'+coef315;
//+',63.5/'+coef63\.5+ ',125/'+coef125+ ',250/'+coef250+ ',500/'+coef500 + ',1000/'+coef1000 + ',2000/'+coef2000 + ',4000/'+coef4000 + ',8000/'+coef8000 + ',16000/'+coef16000);

	//here we send the cmd via telnet
	connection.on('ready', function(prompt) {
	connection.exec(cmd, function(err, response) {
	console.log(response);
	});
	});

	connection.on('timeout', function() {
	console.log('socket timeout!')
	connection.end();
	});

	connection.on('close', function() {
	console.log('connection closed');
	});
	connection.connect(params);
	});



ControllerBrutefirplug.prototype.onStop = function() {
	var self = this;
	exec("killall brutefir", function (error, stdout, stderr) {

	});
};



// Brutefirplug stop
ControllerBrutefirplug.prototype.stop = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'ControllerBrutefirplug::stop');

	return self.sendBrutefirplugCommand('stop', []);
};

ControllerBrutefirplug.prototype.onRestart = function() {
	var self = this;
	//
};

ControllerBrutefirplug.prototype.onInstall = function() {
	var self = this;
	//Perform your installation tasks here
};

ControllerBrutefirplug.prototype.onUninstall = function() {
	var self = this;
	//Perform your installation tasks here
};

ControllerBrutefirplug.prototype.getUIConfig = function() {
	var self = this;

	var defer = libQ.defer();

	var uiconf = fs.readJsonSync(__dirname + '/UIConfig.json');


	uiconf.sections[0].content[0].value = config.get('leftfilter');
	uiconf.sections[0].content[1].value = config.get('rightfilter');
	uiconf.sections[0].content[2].value = config.get('magnitude');
	uiconf.sections[1].content[0].value = config.get('coef31.5');
	uiconf.sections[1].content[1].value = config.get('coef63.0');
	uiconf.sections[1].content[2].value = config.get('coef125');
	uiconf.sections[1].content[3].value = config.get('coef250');
	uiconf.sections[1].content[4].value = config.get('coef500');
	uiconf.sections[1].content[5].value = config.get('coef1000');
	uiconf.sections[1].content[6].value = config.get('coef2000');
	uiconf.sections[1].content[7].value = config.get('coef4000');
	uiconf.sections[1].content[8].value = config.get('coef8000');
	uiconf.sections[1].content[9].value = config.get('coef16000');


	return uiconf;
};

ControllerBrutefirplug.prototype.setUIConfig = function(data) {
	var self = this;
	//Perform your installation tasks here
};

ControllerBrutefirplug.prototype.getConf = function(varName) {
	var self = this;
	//Perform your installation tasks here
};

ControllerBrutefirplug.prototype.setConf = function(varName, varValue) {
	var self = this;
	//Perform your installation tasks here
};

// Public Methods ---------------------------------------------------------------------------------------
// These are 'this' aware, and return a promise





// Internal methods ---------------------------------------------------------------------------
// These are 'this' aware, and may or may not return a promise

// Send command to Brutefir


// Here we write parameter in brutefir config file


ControllerBrutefirplug.prototype.createBrutefirplugFile = function () {
    var self = this;

    var defer=libQ.defer();


    try {

        fs.readFile(__dirname + "/brutefir.conf.tmpl", 'utf8', function (err, data) {
            if (err) {
                defer.reject(new Error(err));
                return console.log(err);
            }
		
            var conf1 = data.replace("${leftfilter}", config.get('leftfiler'));
            var conf2 = data.replace("${rightfilter}", config.get('rightfilter'));

            fs.writeFile("/home/volumio/.brutefir_config_essai", conf2, 'utf8', function (err) {
                if (err)
                    defer.reject(new Error(err));
                else defer.resolve();
            });


        });


    }
    catch (err) {


    }

    return defer.promise;

};

ControllerBrutefirplug.prototype.saveBrutefirconfig = function (data) {
    var self = this;

    var defer = libQ.defer();

    config.set('leftfilter', data['leftfilter']);
    config.set('rightfilter', data['rightfilter']);

    self.rebuildBRUTEFIRPLUGAndRestartDaemon()
        .then(function(e){
            self.commandRouter.pushToastMessage('success', "Configuration update", 'The configuration has been successfully updated');
            defer.resolve({});
        })
        .fail(function(e)
        {
            defer.reject(new Error());
        })


    return defer.promise;

};


ControllerBrutefirplug.prototype.rebuildBRUTEFIRPLUGAndRestartDaemon = function () {
    var self=this;
    var defer=libQ.defer();

    self.createBRUTEFIRPLUGFile()
        .then(function(e)
        {
            var edefer=libQ.defer();
            exec("killall brutefir", function (error, stdout, stderr) {
                edefer.resolve();
            });
            return edefer.promise;
        })
        .then(function(e){
            self.onVolumioStart();
            return libQ.resolve();
        })
        .then(function(e)
        {
            defer.resolve();
        })
        .fail(function(e){
            defer.reject(new Error());
        })

    return defer.promise;
};