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