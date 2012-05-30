/**
FIXME: Enter a description for the <%= moduleName %> module

@module <%= moduleName %>
**/

/**
Enter a description for the <%= moduleName.camelize() %> class

@class <%= moduleName.camelize() %>
@extends Widget
@constructor
**/
var <%= moduleName.camelize() %> = Y.Base.create("<%= moduleName.camelize(true) %>", Y.Widget, [/*Y.WidgetParent*/], {

	/**
	Description
	
	@method initializer
	**/
	initializer: function() {

		// Get localized strings in the current language
		this.resources = Y.Intl.get("<%= moduleName %>");

		/*this.publish("myEvent", {
			defaultFn: this._defMyEventFn,
			bubbles:false
		});*/
	},

	/**
	Description
	
	@method destructor
	**/
	destructor: function() {
		
	},

	/**
	renderUI is part of the lifecycle introduced by the 
	Widget class. Widget's renderer method invokes:
	
		renderUI()
		bindUI()
		syncUI()

	renderUI is intended to be used by the Widget subclass 
	to create or insert new elements into the DOM.
	
	@method renderUI
	@param {type} name description
	@return {type} description
	**/
	renderUI: function() {

		// this._mynode = Node.create(Y.substitute(<%= moduleName.camelize() %>.MYNODE_TEMPLATE, {mynodeid: this.get("id") + "_mynode"})); 
	},

	/**
	Description
	
	@method bindUI
	**/
	bindUI: function() {
	
		// this.after("attrAChange", this._afterAttrAChange);
	},

	/**
	Description
	
	@method syncUI
	**/
	syncUI: function() {

		// this._uiSetAttrA(this.get("attrA"));

	} //,

	// Beyond this point is the <%= moduleName.camelize() %> specific application and rendering logic

	// Attribute state supporting methods (see attribute config above) 

	/*

	_defAttrAVal: function() {
		// this.get("id") + "foo";
	},

	_setAttrA: function(attrVal, attrName) {
		// return attrVal.toUpperCase();
	},

	_getAttrA: function(attrVal, attrName) {
		// return attrVal.toUpperCase();
	},

	_validateAttrA: function(attrVal, attrName) {
		// return Lang.isString(attrVal);
	},

	// Listeners, UI update methods

	_afterAttrAChange: function(e) {
		// Listens for changes in state, and asks for a UI update (controller). 

		// this._uiSetAttrA(e.newVal);
	},

	_uiSetAttrA: function(val) {
		// Update the state of attrA in the UI (view) 

		// this._mynode.set("innerHTML", val);
	},

	_defMyEventFn: function(e) {
		// The default behavior for the "myEvent" event.
	}

	*/

},{

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