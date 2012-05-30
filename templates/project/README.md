# <%= projectName %>

EDIT ME

## Build

Assuming you have the yui builder installed at the same directory level than this project:

    cd lib/src
    ant all

Or you can build components one by one:

    cd lib/src/dummy
    ant all

## Documentation

To build the documentation for this project go to the lib source tree

    cd lib/src

Build the documentation by this command:

    yuidoc .

Documentation will be build into lib/docs.

To run documentation in server mode use:

	yuidoc --server .