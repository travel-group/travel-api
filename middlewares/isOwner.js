var models = require('../models');
var { errorResponse } = require('../helpers/response')

const isOwner = (type) => {
    return async (req, res, next) => {
        const user = await models.users.findByPk(req.user.id)
        if (user?.admin == 1) {
            return next()
        };
        switch (type) {
            case 'post':
                const postId = req.params.id;
                const post = await models.posts.findOne({
                    where: {
                        id: postId
                    }
                })
                console.log("postId = ", postId)
                console.log("post = ", post)
                console.log("post.user_id == ", post?.user_id)
                console.log("req.user.id== ", req.user.id)
                if (post?.user_id === req.user.id) {
                    return next()
                }
                res.status(403)
                return res.send(errorResponse('You are not authorized'))
                
            case 'comment':
                const commentId = req.params.id
                const comment = await models.comments.findOne({
                    where: {
                        id: commentId
                    }
                })
                if (comment?.userId === req.user.id) {
                    return next()
                }
                res.status(403)
                res.send(errorResponse('You are not authorized'))
                return
        };
    };   
}

module.exports = {
    isOwner
}