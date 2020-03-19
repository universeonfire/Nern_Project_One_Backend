class HttpErrors extends Error {
    constructor(mes,errCode){
        super(mes);
        this.code = errCode;
    }
}

module.exports = HttpErrors;