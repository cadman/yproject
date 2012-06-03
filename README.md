# yproject

yproject is a command-line utility to scaffold projects and components using the YUI3 library, the [YUI Build Tool](http://yuilibrary.com/projects/builder) and the [YUIDoc](http://yui.github.com/yuidoc).

It contains a project template and a module template to quickly bootstrap your project enforcing best practices from the start.

## Features

* command to scaffold a project
* command to scaffold a new module group
* command to scaffold a new module
* command to scaffold a new widget (with intl and skin files)

The generated projects include:

* default loader module to generate the YUI3 modules metadata with building script
* development HTTP server using express.js to run tests

Through YUI Builder 

* ANT based build system YUI uses
* Declare module dependencies for the YUI loader
* Code checking with JSlint
* Code & assets minification with YUI Compressor

Through YUIDoc

* Live previews. YUIDoc includes a standalone doc server, making it trivial to preview your docs as you write.
* YUIDoc's generates documentation as an attractive, functional web application with real URLs and graceful fallbacks for spiders and other agents that can't run JavaScript.
* Wide language support. You can use it with any language that supports /* */ comment blocks.

Through YUI Test

* Test Driven Development (TDD) : YUI Test, Selenium
* YUI Test instrumentation script => Test coverage !
* Selenium scripts to launch the tests
* easy Continuous Integration with Hudson

* Think there's too much? The generated project is delete-key friendly. :)

## Installation

Install it as a developer:

	git clone git://github.com/cadman/yproject.git
	cd yproject
	npm link .


## Usage

### Create a new project

	yproject create myproject
		
This will create the following structure:

	myproject/
		.gitignore
		index.html
		lib/
			src/
				build.xml
				yuidoc.json
			meta-loader.php
		media/
		projectName.sublime-project
		README.md
		scripts/
		tests/
			index.html

### Adding a group

Go to your project directory and type:

	yproject group my-group

This will create the following structure in lib/src/:

	my-group/
		build.xml
		js/
		tests/

### Adding a module

Go to your project directory and type:

	yproject module my-module 

This will create the following structure in lib/src/:

	my-module/
		build.my-module.properties
		build.my-module.xml
		build.xml
		js/
			my-module.js
		tests/
			my-module.html

If you want the module to be part of a group then type:

	yproject module my-group my-module

This will add the module structure to your group and preserve already existing files.

### Adding a widget

Go to your project directory and type:

	yproject widget my-widget

This will create the following structure in lib/src/:

	my-widget/
		assets/
			my-widget-core.css
			skins/
				sam/
					my-widget-skin.css
		build.my-widget.properties
		build.my-widget.xml
		build.xml
		js/
			my-widget.js
		lang/
			my-widget_de.js
			my-widget.js
		tests/
			my-module.html

If you want the widget to be part of a group then type:

	yproject widget my-group my-widget

This will add the widget structure to your group and preserve already existing files.

The generated widget is skinable and internationalizable by default.

### Building

You will need the [YUI Builder](http://yuilibrary.com/projects/builder) (which itself requires java & ant)

To build a specific module:

	cd lib/src/my-module
	ant all

To build all modules:

	cd lib/src
	ant all

### Meta loader

In lib/src you find the meta-loader.php. This file generates the Loader Metadata from the */build.*.properties files in the lib/src/ folder.

### Documentation

To build the documentation, you will need a copy of [YUI Doc](http://yui.github.com/yuidoc) installed on your system.

You build the documentation of your project simply by going to lib/src/ and typing:

	yuidoc .

Documentation will be build into lib/docs.

To run documentation in server mode for testing use:

	yuidoc --server .

### Local server

	cd scripts
	node server.js

### Testing

If you're not familiar with YUI Test, I suggest you take a look at those videos:

* http://developer.yahoo.com/yui/theater/video.php?v=adams-yuiconf2009-testing
* http://developer.yahoo.com/yui/theater/video.php?v=yuiconf2010-yuitest

YUI Test

* Write Tests using YUI test. 
* The generated modules contains a default test, which uses the instrumented code

Selenium

* run scripts/gen_tests_xml.js => generates the tests.xml file to launch selenium tests
* Automatically save test results

## Full example

See example.sh to see a complete example

