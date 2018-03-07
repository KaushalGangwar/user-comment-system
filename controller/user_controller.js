/**
 * Created by kaushal on 07/03/18.
 */
'use strict';
/**
 * @module User Model
 */

const Joi       =   require('joi');
const utils     =   require('../routes/utils');
const mongo     =   require('../routes/mongo');

module.exports = {
    registerUser
}

function registerUser(req, res){
    const schema    =   Joi.object().keys({
        username : Joi.string().alphanum().min(3).max(15).required(),
        email : Joi.string().email().required()
    });
    let filter  =   req.body;
    let {error} = Joi.validate(filter, schema);
    if(error){
        let errorName = error.name;
        let errorReason = error.details !== undefined
            ? error.details[0].message
            : 'Parameter missing or parameter type is wrong';
        let err = new Error(errorName + ' ' + errorReason);
        return utils.sendErrorResponse(err, res);
    }
    (async function(){
        let isExistingUser = await mongo.fetchUserFromEmail(filter.email);
        if(Array.isArray(isExistingUser) && isExistingUser.length){
            let response = {
                user_id : isExistingUser[0].user_id,
                username : isExistingUser[0].username
            };
            return response;
        }
        let userId = utils.generateRandomStringAndNumbers(20);
        let userObj = {
            user_id : userId,
            username : filter.username,
            email : filter.email,
            created_at : new Date()
        };
        await mongo.insertUserInDb(userObj);
        return {
            user_id : userId,
            username : filter.username
        };
    })().then(result => {
        return utils.sendResponse(result, res, "User registered successfully");
    }).catch(error => {
        return utils.sendErrorResponse(error, res);
    });
}

