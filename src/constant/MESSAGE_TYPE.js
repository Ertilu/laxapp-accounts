const MESSAGE_TYPE = {
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
};

const isContain = function (data) {
	const dataExist = Object.keys(MESSAGE_TYPE).find((key) => data === MESSAGE_TYPE[key]);
	return !!dataExist;
};

module.exports = {
	...MESSAGE_TYPE,
	isContain: isContain.bind({ MESSAGE_TYPE }),
};
