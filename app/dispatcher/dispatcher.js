let Dispatcher = require('flux').Dispatcher;
let AppDispatcher = new Dispatcher();
let Store = require('./../store/store');

AppDispatcher.register(function(action) {
	Store.addList(action.text);
	Store.emitChange();
})

module.exports = AppDispatcher;