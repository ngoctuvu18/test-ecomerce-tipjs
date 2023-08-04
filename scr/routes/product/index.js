'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const { authenticationV2 } = require('../../auth/authUtils')

//Authentication
router.use(authentication)
// router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct))

module.exports = router
