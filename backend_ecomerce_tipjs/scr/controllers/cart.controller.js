'use strict'

const CartService = require('../services/cart.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add To Cart success !!',
      metadata: await CartService.addToCart(req.body),
    }).send(res)
  }
  updateToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Cart success !!',
      metadata: await CartService.addToCartV2(req.body),
    }).send(res)
  }
  deleteUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Cart success !!',
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res)
  }
  getListUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Add To Cart success !!',
      metadata: await CartService.getListUserCart(req.query),
    }).send(res)
  }
}

module.exports = new CartController()
