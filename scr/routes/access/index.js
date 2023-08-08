'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

//singUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

//Authentication
// router.use(authentication)
router.use(authenticationV2)
//logout
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshTokenV2))
module.exports = router
