let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let Store = assign({}, EventEmitter.prototype, {
	list: [],
	getListAll() {
		return this.list;
	},
	addList(str) {
		this.list.push(str);
	},
	addChange(fCallback) {
		this.on('change', fCallback);
	},
	emitChange() {
		this.emit('change');
	}
})

module.exports = Store;