/**
 * Created by kaushal on 07/03/18.
 */
const constants   =   require('./constants');

module.exports = {
    sendErrorResponse,
    sendResponse,
    generateRandomStringAndNumbers
};

/**
 * Sends a response in case of an error
 * @param  {object} error       {responseFlag, responseMessage}
 * @param  {stream} res         express res stream
 */

function sendErrorResponse(error, res) {
    if (!error.responseFlag) {
        error.responseFlag = constants.statusCodes.METHOD_FAILURE;
    }
    if (!error.responseMessage) {
        error.responseMessage =
            error.message || "Something went wrong.Please try again"
    }
    let response = {
        flag: error.responseFlag,
        message: error.responseMessage
    };
    res.send(JSON.stringify(response));
}

/**
 * Sends a given response object.
 * @param  {object} response    Contains the final result of any API
 * @param  {stream} res         express res stream
 * @param  {string} msg         response message
 */
function sendResponse(response, res, msg) {

    let responseObj = {
        flag : constants.statusCodes.ACTION_COMPLETE,
        message : msg || "Action complete",
        data : response || []
    };
    res.send(responseObj);
}
function generateRandomStringAndNumbers(len) {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

