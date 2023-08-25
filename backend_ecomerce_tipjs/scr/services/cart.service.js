'use strict'
const { NotFoundError } = require('../core/error.response')
const { cart } = require('../models/cart.model')
const { getProductById } = require('../models/repositories/product.repo')

/*
    Key features: Cart Service
    - add product to cart [user]
    - reduce product quantity by one [User]
    - increase product quantity by one [User]
    - Get list to cart [User]
    - Delete cart [User]
    - Delete cart item [user]
*/
class CartService {
  //Start Cart repo
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true }
    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = { cart_userId: userId, cart_state: 'active', 'cart_products.productId': productId },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity,
        },
      },
      options = { upsert: true, new: true }
    return await cart.findOneAndUpdate(query, updateSet, options)
  }
  //End cart repo
  static async addToCart({ userId, product = {} }) {
    //check cart co ton tai hay khong ??
    const userCart = await cart.findOne({ cart_userId: userId })
    if (!userCart) {
      //create cart to User
      return CartService.createUserCart({ userId, product })
    }
    // neu co gio hang roi nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }
    //gio hang ton tai va co san pham thi update quantity
    return CartService.updateUserCartQuantity({ userId, product })
  }
  //update cart
  /*
    shop_order_ids:[
        {
            shopId,
            item_products:[{quantity, price, shopId, productId, old_quantity}],
            version
        }
    ]
  */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { quantity, productId, old_quantity } = shop_order_ids[0]?.item_products[0]
    //check product
    const foundProduct = await getProductById(productId)
    if (!foundProduct) throw new NotFoundError('')
    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop')
    }
    if (quantity === 0) {
      //deleted
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    })
  }
  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: { productId },
        },
      }
    const deleteCart = await cart.updateOne(query, updateSet)
    return deleteCart
  }
  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: +userId }).lean()
  }
}
module.exports = CartService
