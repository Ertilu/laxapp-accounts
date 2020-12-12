const MESSAGE_TYPE = require('../constant/MESSAGE_TYPE');

class Message {
	constructor(type, data) {
		if (!MESSAGE_TYPE.isContain(type)) throw new Error('Unknown Message type');
		this.type = type;
		this.data = data;
	}
}

module.exports = Message;
