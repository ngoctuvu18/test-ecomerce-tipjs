'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const discount = require('../models/discount.model')
const { product } = require('../models/product.model')
const { findAllDiscountCodesSelect, checkDiscountExits } = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

/*
Discount Service
1- Generator Discount Code [Shop/Admin]
2- Get Discount amount [User]
3- Get All discount Codes [User|Shop]
4- Verify discount Code [User]
5- Delete discount code [Admin|Shop]
6- Cancel discount code [user]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      user_used,
    } = payload
    //kiem tra
    if (new Date() < Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expried !')
    }
    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before End date !')
    }
    //create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shop_id: convertToObjectIdMongodb(shopId),
      })
      .lean()
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exits !!')
    }
    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_user_used: user_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shop_id: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    })
    return newDiscount
  }
  /*
  Get all discount codes available with products
  */
  static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
    //create index for discount_code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shop_id: convertToObjectIdMongodb(shopId),
      })
      .lean()
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount not exits !!')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products
    if (discount_applies_to === 'all') {
      //get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      })
    }
    if (discount_applies_to === 'specific') {
      //get the products ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      })
    }
    return products
  }

  /*
  get All discount codes of Shop
  */
  static async getAllDiscountCodesByShop({ page, shopId, limit }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      select: ['discount_name', 'discount_code'],
      model: discount,
    })
    return discounts
  }
  /*
    Apply Discount Codes
  */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExits({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shop_id: convertToObjectIdMongodb(shopId),
      },
    })
    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exits !!`)
    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_user_used,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_type,
      discount_value,
    } = foundDiscount
    if (!discount_is_active) throw new NotFoundError(`Discount expried !!`)
    if (!discount_max_uses) throw new NotFoundError(`Discount are out !!`)
    if (new Date() < Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError('Discount code has expried !')
    }
    //check xem co get gia tri toi thieu hay khong
    let totalOrder = 0
    if (discount_min_order_value > 0) {
      //get total
      totalOrder = products?.reduce((acc, product) => {
        return acc + product?.quantity * product?.price
      }, 0)
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value} !`)
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_user_used.find(user => user.userId === userId)
      if (userUserDiscount) {
        //....
      }
    }
    //check xem discount nay la fixed_amount
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    }
  }

  static async deleteDiscountCode({ codeId, shopId }) {
    const deleted = await discount.findByIdAndDelete({
      discount_code: codeId,
      discount_shop_id: convertToObjectIdMongodb(shopId),
    })
    return deleted
  }
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExits({
      model: discount,
      filter: {
        discount_code: code,
        discount_shop_id: convertToObjectIdMongodb(shopId),
      },
    })
    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exits !!`)
    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_user_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    })
    return result
  }
}
module.exports = DiscountService
