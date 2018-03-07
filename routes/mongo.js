/**
 * Created by kaushal on 07/03/18.
 */

module.exports = {
    fetchUserFromEmail,
    insertUserInDb,
    insertCommentInDb,
    insertReply,
    fetchAllComments,
    deleteComment
};

function fetchUserFromEmail(email){
    email = email.replace(/[\-[]\/\{\}()*\+\?\.\\\^\$\|]/g, "\\$&");
    return new Promise((resolve, reject) => {
        let filter = {
            email : new RegExp(email, 'i')
        };
        db.collection('user').find(filter).toArray((error, result) => {
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
}

function insertUserInDb(params){
    return new Promise((resolve, reject) => {
        db.collection('user').insert(params, (error, result) => {
            if(error){
                return reject(error);
            }
            return resolve();
        });
    });
}

function insertReply(updateCondition, updateParams){
    return new Promise((resolve, reject) => {
        db.collection('comments').update(updateCondition,updateParams, (error, result) => {
            if(error){
                return reject(error);
            }
            return resolve();
        })
    })
}

function insertCommentInDb(params){
    return new Promise((resolve, reject) => {
        db.collection('comments').insert(params, (error, result) => {
            if(error){
                return reject(error);
            }
            return resolve();
        })
    })
}

function fetchAllComments(params = {}){
    return new Promise((resolve, reject) => {
        var filter = {
            is_active : 1
        };
        if(params.user_id){
            filter.user_id = params.user_id
        }
        db.collection('comments').find(filter).toArray((error, result) => {
            if(error){
                return reject(error);
            }
            return resolve(result);
        });
    });
}

function deleteComment(params){
    let [updateCondition, updateParams] = params;
    return new Promise((resolve, reject) => {
        db.collection('comments').update(updateCondition, updateParams, (error, result) => {
            if(error){
                return reject(error);
            }
            return resolve();
        })
    })
}
