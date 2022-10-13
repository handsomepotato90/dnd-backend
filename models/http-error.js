class HttpError extends Error{
    constructor(message,errorCode){
        super(message);//add a message property
        this.code = errorCode;//adda a code property
    }
}
module.exports = HttpError;