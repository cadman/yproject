#!/usr/bin/env node

var path = require("path"),
	fs = require("fs"),
	ejs = require("ejs"),
	xml2js = require("xml2js");

if(!String.prototype.camelize) {
	/**
	Camelizes a string

	@example
		"my-widget".camelize() => "MyWidget"
		"my-widget".camelize(true) => "myWidget"
	
	@method camelize
	@extends String
	@param {boolean} lowFirstLetter Whether first letter should be lowercase or not
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
		Group command to create a group from templates/group

		@method group
		**/
		group: function (arglist) {
			var moduleName = arglist[0];

			if(!moduleName) {
				console.log("ERR: Missing module name");
				this.help();
				return;
			}

			yproject.createFromTemplate('group', moduleName, null);
			
		},

		/**
		Widget command to create a widget from templates/widget

		@method widget
		**/
		widget: function (arglist) {
			var moduleName, moduleGroup;

			if (arglist.length > 1) {
				moduleGroup = arglist[0];
				moduleName = arglist[1];
			} else {
				moduleGroup = null;
				moduleName = arglist[0];
			}

			if(!moduleName) {
				console.log("ERR: Missing module name");
				this.help();
				return;
			}

			yproject.createFromTemplate('widget', moduleName, moduleGroup);
			
		},
		
		/**
		Module command to create a module from templates/module

		@method module
		**/
		module: function (arglist) {
			var moduleName, moduleGroup;

			if (arglist.length > 1) {
				moduleGroup = arglist[0];
				moduleName = arglist[1];
			} else {
				moduleGroup = null;
				moduleName = arglist[0];
			}

			if(!moduleName) {
				console.log("ERR: Missing module name");
				this.help();
				return;
			}
			
			yproject.createFromTemplate('module', moduleName, moduleGroup);
			
		},

		/**
		CSS command to create a CSS module from templates/css

		@method css
		**/
		css: function (arglist) {
			var moduleName, moduleGroup;

			if (arglist.length > 1) {
				moduleGroup = arglist[0];
				moduleName = arglist[1];
			} else {
				moduleGroup = null;
				moduleName = arglist[0];
			}

			if(!moduleName) {
				console.log("ERR: Missing module name");
				this.help();
				return;
			}
			
			yproject.createFromTemplate('css', moduleName, moduleGroup);
			
		},
		
		/**
		Help command to get hints on usage
		
		@method help
		**/
		help: function (arglist) {
			console.log("Usage:");
			console.log("\t'yproject create my-project'\tCreate a project from scratch");
			console.log("\t'yproject group my-group'\tAdd a group to the current project");
			console.log("\t'yproject module my-module'\tAdd a module to the current project");
			console.log("\t'yproject module my-group my-submodule'\tAdd a submodule to a group of the current project");
			console.log("\t'yproject widget my-widget'\tAdd a widget module to the current project");
			console.log("\t'yproject widget my-group my-widget'\tAdd a widget module to a group of the current project");
			console.log("\t'yproject css my-css'\tAdd a css module to the current project");
			console.log("\t'yproject css my-group my-css'\tAdd a css module to a group of the current project");
		}
		
	},
	
	/**
	Creates new folder for module in lib/src from corresponding template folder of current module type
	
	@method createFromTemplate
	@param {String} template Name of the template folder
	@param {String} moduleName Name of the module to create
	**/
	createFromTemplate: function (template, moduleName, moduleGroup) {
		var parser = new xml2js.Parser(),
			moduleNamespaced = [],
			dir, data;

		if (fs.existsSync("lib/src/build.xml")) {
			dir = "lib/src/";
		} else if (fs.existsSync("fileadmin/templates/lib/src/build.xml")) {
			dir = "fileadmin/templates/lib/src/";
		} else if (fs.existsSync("src/build.xml")) {
			dir = "src/";
		} else {
			console.log("ERR: Lib folder not found");
			return;
		}

		data = fs.readFileSync(dir + "build.xml", encoding = "utf8");

		if (moduleGroup && typeof moduleGroup === "string" && moduleGroup !== "") {
			moduleNamespaced.push(moduleGroup);
		} else {
			moduleGroup = "";
		}

		moduleNamespaced.push(moduleName);

		dir += moduleNamespaced[0];

		parser.addListener("end", function (result) {
			var locals = {
				projectName: result["@"]["name"],
				moduleGroup: moduleGroup,
				moduleNamespaced: moduleNamespaced.join("-"),
				moduleName: moduleName
			};
			yproject.copyDirSyncRecursive(__dirname + "/../templates/" + template, dir, locals);
			
			console.log("Done! Successfully created " + moduleName + "!\n");
			
		});
		parser.parseString(data);
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
		
		if (!fs.existsSync(newDirLocation)) {
			fs.mkdirSync(newDirLocation, checkDir.mode);
			console.log("Created " + newDirLocation);
		} else {
			console.log("Not modified existing " + newDirLocation);
		}

		files = fs.readdirSync(sourceDir);

		for(i = 0; i < files.length; i += 1) {
			currFile = fs.statSync(sourceDir + "/" + files[i]);
			
			origFile = sourceDir + "/" + files[i];

			if(currFile.isDirectory()) {
				this.copyDirSyncRecursive(origFile, newDirLocation + "/" + files[i], locals);
			} else {

				fName = files[i];
				for (l in locals) {
					fName = fName.replace(l, locals[l]);
				}

				f = newDirLocation + "/" + fName;

				if (!fs.existsSync(f)) {
					tpl = fs.readFileSync(origFile, encoding = "utf8");
	
					contents = ejs.render(tpl, {locals: locals});

					fs.writeFileSync(f, contents, encoding = "utf8");
					console.log("Created " + f);
				} else {
					console.log("Not modified existing " + f);
				}
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
