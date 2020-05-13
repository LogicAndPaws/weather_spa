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
    constructor(mainField, parameters){
        this.mainField = mainField;
        this.parameters = parameters;
    }
}