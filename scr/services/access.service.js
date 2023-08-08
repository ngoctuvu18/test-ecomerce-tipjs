'use strict'
const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')
const { RoleShop } = require('../helpers/consts')

class AccessService {
  /*
  - check this token used??
   */
  static handlerRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend !! Pls Relogin')
    }
    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered !!')

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered 2 !!')
    // create 1 cap token moi
    const tokens = await createTokenPair({ email, userId }, keyStore.publicKey, keyStore.privateKey)
    //update tokens
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // da duoc su dung de lay token moi
      },
    })
    return {
      user,
      tokens,
    }
  }
  //V1
  static handlerRefreshToken = async refreshToken => {
    //check xem token nay da duoc su dung chua??
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
    //neu co
    if (foundToken) {
      // decode xem la thang nao??
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
      console.log({ userId, email })
      //xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend !! Pls Relogin')
    }
    //chua co
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError('Shop not registered !!')
    // verify Token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    console.log('[2]---->', { userId, email })
    //check userId
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered !!')
    // create 1 cap token moi
    const tokens = await createTokenPair({ email, userId }, holderToken.publicKey, holderToken.privateKey)
    //update tokens
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // da duoc su dung de lay token moi
      },
    })
    return {
      user: { email, userId },
      tokens,
    }
  }

  static logout = async keyStore => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    console.log(delKey)
    return delKey
  }

  /*
    1- check email in dbs
    2- match password
    3- create AT vs RT and save
    4- generate token
    5-get data return login
   */

  static login = async ({ email, password, refreshToken = null }) => {
    //1.check email in dbs
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Shop not registered!!')
    //2.match password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication Error')
    //3.create AT vs RT and save
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    //4.generate token
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    })
    return {
      shop: getInfoData({
        fileds: ['_id', 'name', 'email'],
        object: foundShop,
      }),
      tokens,
    }
  }

  static signUp = async ({ name, email, password }) => {
    // try {
    // step1: check email exists???
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new BadRequestError('Error: Shop already registered !')
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    })
    if (newShop) {
      //tao theo rsa
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // })
      // const publicKeyString = await KeyTokenService.createKeyToken({
      //   userId: newShop._id,
      //   publicKey,
      //   privateKey
      // })
      //     if (!publicKeyString) {
      //       return {
      //         code: 'xxx',
      //         message: 'publicKeyString error',
      //       }
      //     }
      //     const publicKeyObject = crypto.createPublicKey(publicKeyString)
      //     //created token pair
      //     const tokens = await createTokenPair(
      //       { userId: newShop._id, email },
      //       publicKeyObject,
      //       privateKey,
      //     )
      //     console.log(`Created Token success:: `, tokens)
      //     return {
      //       code: 201,
      //       metadata: {
      //         shop: getInfoData({
      //           fileds: ['_id', 'name', 'email'],
      //           object: newShop,
      //         }),
      //         tokens,
      //       },
      //     }
      //   }
      //   return {
      //     code: 200,
      //     metadata: null,
      //   }
      // } catch (error) {
      //   return {
      //     code: 'xxx',
      //     message: error.message,
      //     status: 'error',
      //   }
      // }

      //created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      console.log({ privateKey, publicKey }) // save collection KeyStore
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      })
      if (!keyStore) {
        return {
          code: 'xxx',
          message: 'keyStore error',
        }
      }

      //created token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
      console.log(`Created Token success:: `, tokens)
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ['_id', 'name', 'email'],
            object: newShop,
          }),
          tokens,
        },
      }
    }
    return {
      code: 200,
      metadata: null,
    }
    // } catch (error) {
    return {
      code: 'xxx',
      message: error.message,
      status: 'error',
    }
  }
}
// }

module.exports = AccessService
