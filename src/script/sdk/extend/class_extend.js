// format method for String
String.prototype.format = function( args ) {
	var result = this;

	if (arguments.length < 1) {
		return result;
	}

	//如果模板参数是数组
	var data = arguments;

	if (arguments.length == 1 && typeof (args) == "object") {
		//如果模板参数是对象
		data = args;
	}

	for (var key in data) {
		var value = data[key];
		if (undefined != value) {
			result = result.replace("{" + key + "}", value);
		}
	}

	return result;
}