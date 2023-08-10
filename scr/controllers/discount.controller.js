'use strict'

const DiscountService = require('../services/discount.service')
const { SuccessResponse } = require('../core/success.response')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Discount Code success !!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res)
  }
  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Discount Codes By Shop success !!',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res)
  }
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Discount Amount success !!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res)
  }
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Discount Codes With Product success !!',
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res)
  }
}
module.exports = new DiscountController()
