/**
 * Created by kaushal on 07/03/18.
 */

const utils = require('./utils');
const uuidv1 = require('uuid/v4');
const Joi = require('joi');
const mongo =  require('./mongo');

module.exports = {
    postComment,
    replyToComment,
    viewAllComments,
    deleteComment
};

function postComment(req, res){
    let filter = req.body;
    let schema = Joi.object().keys({
        user_id : Joi.string().required(),
        username : Joi.string().required(),
        comment : Joi.string().required().min(1)
    });
    let {error} = Joi.validate(filter, schema);
    if(error){
        let errorName = error.name;
        let errorReason = error.details
            ? error.details[0].message
            : 'Parameter missing or parameter type is wrong';
        let err = new Error(errorName + ' ' + errorReason);
        return utils.sendErrorResponse(err, res);
    }
    (async function(){
        let insertionParam = {
            user_id : filter.user_id,
            username : filter.username,
            comment : filter.comment,
            comment_id : uuidv1(),
            is_active : 1,
            replies : []
        };
        await mongo.insertCommentInDb(insertionParam);
        return {
            comment_id : insertionParam.comment_id
        };
    })().then(result => {
        return utils.sendResponse(result, res, "Comment Posted");
    }).catch(error => {
        return utils.sendErrorResponse(error, res);
    });
}


function replyToComment(req, res){
    let filter = req.body;
    let schema = Joi.object().keys({
        user_id : Joi.string().required(),
        comment_id : Joi.string().required(),
        comment : Joi.string().min(1).required(),
        username : Joi.string().required()
    });
    let {error} = Joi.validate(filter, schema);
    if(error){
        let errorName = error.name;
        let errorReason = error.details
            ? error.details[0].message
            : 'Parameter missing or parameter type is wrong';
        let err = new Error(errorName + ' ' + errorReason);
        return utils.sendErrorResponse(err, res);
    }
    (async function(){
       let updateQuery = {
           comment_id : filter.comment_id
       };
       let replyObj = {
           comment_id : uuidv1(),
           comment : filter.comment,
           username : filter.username,
           user_id : filter.user_id,
           is_active : 1
       };
       let updateParams = {
           $push : {
               replies : replyObj
           }
       }
        await mongo.insertReply(updateQuery, updateParams);
    })().then(() => {
        return utils.sendResponse(null, res, "Reply posted");
    }).catch(error => {
        return utils.sendErrorResponse(error, res);
    });
}


function viewAllComments(req, res){
    let user_id = req.query.user_id;
    mongo.fetchAllComments({user_id}).then(result => {
        return utils.sendResponse(result, res, "")
    }).catch(error => {
        return utils.sendErrorResponse(error, res);
    })
}

function deleteComment(req, res){
    let filter = req.body;
    let schema = Joi.object().keys({
        is_reply : Joi.number().optional(),
        comment_id : Joi.string().required()
    });
    let {error} = Joi.validate(filter, schema);
    if(error){
        let errorName = error.name;
        let errorReason = error.details
            ? error.details[0].message
            : 'Parameter missing or parameter type is wrong';
        let err = new Error(errorName + ' ' + errorReason);
        return utils.sendErrorResponse(err, res);
    }
    (async function(){
        let updateCondition = {};
        let updateParams = {};
        if(filter.is_reply){
            updateCondition['replies.comment_id'] = filter.comment_id;
            updateParams['$set'] = {
                'replies.$.is_active' : 0
            };
        }
        else{
            updateCondition.comment_id = filter.comment_id;
            updateParams['$set'] = {
                is_active : 0
            };
        }
        await mongo.deleteComment([updateCondition, updateParams]);
    })().then(() => {
        return utils.sendResponse(null, res, "Comment deleted");
    }).catch(error => {
        return utils.sendErrorResponse(error, res);
    });
}
