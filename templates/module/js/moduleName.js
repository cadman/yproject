/**
Enter a description for the <%= moduleName %> module

@module <%= moduleName %>
**/
var <%= moduleName.camelize() %>;

/**
Enter a description for the <%= moduleName %> class

@class <%= moduleName.camelize() %>
@extends Base
@constructor
**/
<%= moduleName.camelize() %> = Y.Base.create('<%= moduleName.camelize(true) %>', Y.Base, [], {
	
	/**
	Description
	
	@method someMethod
	**/
	someMethod: function () {

	}

}, {

	ATTRS: {
		
		/*

		attrA: {
			value: "A",
			valueFn: "_defAttrAVal" ,
			setter: "_setAttrA",
			getter: "_getAttrA",
			validator: "_validateAttrA" ,
			readOnly: true ,
			writeOnce: true,
			lazyAdd: false ,
			broadcast: 1 
		}

		*/

	}
});

Y.<%= moduleName.camelize() %> = <%= moduleName.camelize() %>;