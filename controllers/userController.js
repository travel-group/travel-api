var models = require('../models')
var { errorResponse, successResponse } = require('../helpers/response')
const { Op } = require("sequelize");
var authService = require('../services/auth');
var {userTransformer , usersTransformer} = require('../transformers/usersTransformers')
var { postsTransformer } = require('../transformers/postsTransformer')

const signUp = async (req, res) => {
    const username = req?.body?.username
    const email = req?.body?.email
    const firstname = req?.body?.firstname
    const lastname = req?.body?.lastname
    const password = req?.body?.password
    if (username?.length < 3) {
        res.send(errorResponse('Username is too short'))
    }
    if (firstname?.length < 3) {
        res.send(errorResponse('Frist name is too short'))
    }
    if (lastname?.length < 3) {
        res.send(errorResponse('last name is too short'))
    }
    if (password?.length < 6) {
        res.send(errorResponse('Password is too short'))
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
        res.send(errorResponse('Email is invalid'))
    }
    const [result , created] = await models.users.findOrCreate({
        where: {
                email,
                username
        },
        defaults: {
            firstname,
            lastname,
            password: authService.hashPassword(password),
        }
    })
    if (result , created) {
        res.send(successResponse('User created successfully'))
    } else {
        res.send(errorResponse('User is already registered'))
    }
}


const logIn = async (req, res, next) => {
    var userNameOrEmail = req.body.userNameOrEmail
    var password = req.body.password
    const user = await models.users.findOne({
        where: {
            [Op.or]:
                [
                    { email: userNameOrEmail }, 
                    { username: userNameOrEmail }
                ]
        }
    })
    if (user) {
        if (authService.comparePasswords(password,user.password)) {
            res.send(successResponse("Success", {token: authService.signUser(user)}))
        } else {
            res.send(errorResponse('Password is wrong'))
        }
    } else {
        res.send(errorResponse('Username or Email is wrong'))
    }
}


const getUsers = async (req, res) => {
    const users = await models.users.findAll({})
    if(users){
        res.send(successResponse("Success" , {users: usersTransformer(users)}))
        return
    }
}


const profile = async (req, res) => {
    const id = req.params.id
    const user = await models.users.findOne({
        where: {
            id
        }})
    if (user) {
        res.send(successResponse("Success", {user: (user)}))
        return
    } else {
        res.send(errorResponse('There was an error'))
        return
    }
}


const deleteUser = async (req,res) => {
    const id = +req.params.id
    const user = await models.users.findByPk(id)
    if(user) {
        if(user) {
            const deleted = await models.users.destroy({
                where: {
                    id
                }
            })
            if (deleted) {
                return res.send(successResponse('User deleted'))
            } else {
                return res.send(errorResponse('error'))
            }
        }
    }
}

const getUserPosts = async (req , res , next) => {
    const posts = await models.posts.findAll({
        where :{
            '$User.id$': req.user.id
        },
        include : [
            {model : models.users},
            {model : models.categories},
            {model : models.countries}
        ]
    })
    res.send(successResponse("Success", {posts: postsTransformer(posts)}))

}

const updateUser = async (req , res) => {
    const id = req.params.id;
    const username = req?.body?.username
    const email = req?.body?.email
    const firstname = req?.body?.firstname
    const lastname = req?.body?.lastname
    const password = req?.body?.password

    const user = await models.users.findByPk(id)
    if(!user) return res.send(errorResponse('User not found'))

    if (!firstname) firstname = user.firstname
    if (!lastname) lastname = user.lastname
    if (!email) email = user.email
    if (!username) username = user.username
    if (!password) password = user.password

    if (firstname?.length < 3) {
        res.send(errorResponse('New First name is too short'))
        return 
    }
    if (lastname?.length < 3) {
        res.send(errorResponse('New last name is too short'))
        return 
    }
    if (username?.length < 3) {
        res.send(errorResponse('New username is too short'))
        return 
    }
    if (password?.length < 6) {
            res.send(errorResponse('New password is too short'))
            return 
        }
        
        const newUser = await models.users.update({
            firstname,
            lastname,
            email,
            username,
            password : authService.hashPassword(password)
        },
        {
            where : {
                id : user.id
            }
        }
        )
        if (newUser) {
            res.send(successResponse('User has been updated', {usr:(newUser)}))
            return 
        } else {
            res.send(errorResponse('Error'))
            return
        }
}


const logOut = async (req, res) => {
    const token = req.user.token;
    const [result, created] = await models.token.findOrCreate({
        where: {
            token
        },
        defaults: {
            token
        }
    })
    console.log(result) 
        if (created)
            return res.send(successResponse("Logged out"));
            return res.send(errorResponse("Invalidating token has failed"));
    };



module.exports = {
    signUp,
    logIn,
    profile,
    getUsers,
    getUserPosts,
    updateUser,
    deleteUser,
    logOut
}