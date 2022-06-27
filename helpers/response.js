exports.successResponse = function(messages = '', extras = {}) {
    var response = {
        success: true,
        messages
    }
    response = {...response, ...extras}
    return response
}
exports.errorResponse = function(messages = '', data = []) {
    var response = {
        success: false,
        data,
        messages
    }
    return response
}