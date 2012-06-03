#!/usr/bin/env node

var fs = require("fs"), ejs = require("ejs"), xml2js = require("xml2js");

// "widget-parent".camelize() -> "WidgetParent"
if(!String.prototype.camelize) {
	/**
	Camelizes a string

	@example
		"my-widget".camelize() => "myWidget"
	
	@method camelize
	@extends String
	@param {boolean} lowFirstLetter Whether firt letter should be uppercase or not
	@return {String} Camelized String
	**/
	String.prototype.camelize = function (lowFirstLetter) {
		var str = this.toLowerCase();
		var str_path = str.split("/");
		for(var i = 0; i < str_path.length; i += 1) {
			var str_arr = str_path[i].split("-");
			var initX = ( (lowFirstLetter && i + 1 === str_path.length) ? (1) : (0) );
			for(var x = initX; x < str_arr.length; x += 1) {
				str_arr[x] = str_arr[x].charAt(0).toUpperCase() + str_arr[x].substring(1);
			}
			str_path[i] = str_arr.join("");
		}
		str = str_path.join("::");
		return str;
	};
}


var argv = process.argv.slice(2),
	arg = "",
	conf = {},
	key,
	arglist = [],
	command,
	flagsDone;

yproject = {
	
	commands: {
		
		/**
		Create command to create project from templates/project

		@method create
		**/
		create: function (arglist) {
			var projectName = arglist[0];

			if(!projectName) {
				console.log("ERR: Missing project name");
				this.help();
				return;
			}
			yproject.copyDirSyncRecursive(__dirname + "/../templates/project", projectName, {projectName: projectName});
		},
		
		/**
		Create command to create a widget from templates/widget

		@method widget
		**/
		widget: function (arglist) {
			var moduleName = arglist[0],
				data, parser;

			if(!moduleName) {
				console.log("ERR: Missing module name");
				this.help();
				return;
			}

			// Retrieve the project name:
			data = fs.readFileSync("lib/src/build.xml", encoding = "utf8");
			
			parser = new xml2js.Parser();
			parser.addListener("end", function (result) {
				var projectName = result["@"]["name"];
				yproject.copyDirSyncRecursive(__dirname + "/../templates/widget", "lib/src/" + moduleName, {projectName: projectName, moduleName: moduleName});
				
				console.log("Done !");
				console.log("Now edit the build.properties file to set the correct path to the builder");
				
			});
			parser.parseString(data);
			
		},
		
		/**
		Create command to create a module from templates/module

		@method module
		**/
		module: function (arglist) {
			var moduleName = arglist[0],
				data, parser;
			if(!moduleName) {
				console.log("ERR: Missing module name");
				this.help();
				return;
			}
			
			// Retrieve the project name:
			data = fs.readFileSync("lib/src/build.xml", encoding = "utf8");
			
			parser = new xml2js.Parser();
			parser.addListener("end", function (result) {
				var projectName = result["@"]["name"];
				yproject.copyDirSyncRecursive(__dirname + "/../templates/module", "lib/src/" + moduleName, {projectName: projectName, moduleName: moduleName});
				
				console.log("Done !");
				console.log("Now edit the build.properties file to set the correct path to the builder");
			});
			parser.parseString(data);
			
		},
		
		/**
		Help command to get hints on usage
		
		@method help
		**/
		help: function (arglist) {
			console.log("Usage:");
			console.log("\t'yproject create myproject'\tCreate a project from scratch");
			console.log("\t'yproject module mymodule'\tAdd a module to the current project");
			console.log("\t'yproject widget my-widget'\tAdd a widget module to the current project");
		}
		
	},
	
	/**
	Copies the source directory recirsively to new location and replaces all placeholders for locals
	
	@method copyDirSyncRecursive
	@param {String} sourceDir Source directory of template files
	@param {String} newLocation Target directory for parsed template files
	@param {Object}	locals Object containing key value pairs for replacing during parsing
	**/
	copyDirSyncRecursive: function (sourceDir, newLocation, locals) {

		var checkDir = fs.statSync(sourceDir),
			newDirLocation = newLocation,
			files, currFile, origFile, tpl, contents, fName, f, k, i, l;

		for(k in locals) {
			newDirLocation = newDirLocation.replace(k, locals[k]);
		}
		
		fs.mkdirSync(newDirLocation, checkDir.mode);
		console.log("Create " + newDirLocation);

		files = fs.readdirSync(sourceDir);

		for(i = 0; i < files.length; i += 1) {
			currFile = fs.statSync(sourceDir + "/" + files[i]);
			
			origFile = sourceDir + "/" + files[i];

			if(currFile.isDirectory()) {
				this.copyDirSyncRecursive(origFile, newDirLocation + "/" + files[i], locals);
			} else {
				tpl = fs.readFileSync(origFile, encoding = "utf8");
	
				contents = ejs.render(tpl, {locals: locals});

				fName = files[i];
				for (l in locals) {
					fName = fName.replace(l, locals[k]);
				}

				f = newDirLocation + "/" + fName;
				fs.writeFileSync(f, contents, encoding = "utf8");
				console.log("Created " + f);
			}
		}
	}
};


while (arg = argv.shift()) {
	if (!key && (arg.match(/^-+[h?]$/i) || arg.match(/^-+help$/i))) {
		arg = "--usage";
	}

	if (!command && (yproject.commands.hasOwnProperty(arg))) {
		if (key) {
			conf[key] = true;
			key = null;
		}
		command = arg;
	} else if (!flagsDone && arg.substr(0, 2) === "--") {
		if (key) {
			conf[key] = true;
		}
		key = arg.substr(2);
		if (key === "usage") {
			conf[key] = true;
			key = null;
		}
		flagsDone = (key === "");
	} else if (key) {
		conf[key] = arg;
		key = null;
	} else {
		arglist.push(arg);
	}
}

if (key) {
	conf[key] = true;
}

process.on("uncaughtException", function(e) {
	console.log("A bad exception occured :");
	console.log(e);
});

if (!command) {
	conf.usage = true;
}

if (conf.usage && command !== "help") {
	arglist.unshift(command);
	command = "help";
}

yproject.commands[command](arglist);
