let DispatcherObj = require('./../dispatcher/dispatcher');

let Action = {
	addList: function(str) {
		DispatcherObj.dispatch({
			type: 'aaa',
			text: str
		})
	}
};

module.exports = Action;