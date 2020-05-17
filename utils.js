exports.User = class {
    constructor(email, password, status){
        this.email = email;
        this.password = password;
        this.status = status;
    }
}

exports.Endpoint = class {
    constructor(owner, address){
        this.owner = owner;
        this.address = address;
    }
}

exports.Data = class {
    constructor(owner, data, date){
        this.owner = owner;
        this.data = data;
        this.date = date;
    }
}

exports.strDate = function(date){
    return date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
}

exports.bin2string = function(array){
    var result = "";
	for(var i = 0; i < array.length; ++i){
		result+= (String.fromCharCode(array[i]));
	}
	return result;
}