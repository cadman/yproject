# <%= projectName %>

EDIT ME

## Build

Assuming you have the YUI Builder installed at the same directory level than this project:

	cd lib/src
	ant all

Or you can build components one by one:

	cd lib/src/module
	ant all

## Documentation

Assuming you have the YUI Doc installed go to the lib source tree:

	cd lib/src

Build the documentation into lib/docs by this command:

	yuidoc .

To run documentation in server mode for testing use:

	yuidoc --server .