exports.getDate = function() {
    return new Date();
}

exports.getString = (key) => {
    switch (key) {
		case "greeting":
			return "Hello ";
		case "user":
			return "User";
		case "serverTime":
			return ". Server current date and time is ";
		case "nothing":
			return "Nothing To Write";
		case "successfulWrite1":
			return `Successfully Wrote "`;
		case "successfulWrite2":
			return `" to `;
		case "successfulWrite3":
			return `file.txt`;
		case "404":
			return " - 404 not found";
		default:
			throw new Error(`Key: "${key}" not found`);
	}
}