'use strict'

const keytokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // tao bao mat rsa
      // const publicKeyString = publicKey.toString()
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // })

      //tao binh thuong level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // })
      // return tokens ? tokens.publicKey : null

      //level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true }
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async userId => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async id => {
    return await keytokenModel.deleteOne(id)
  }
  static findByRefreshTokenUsed = async refreshToken => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken })
  }
  static findByRefreshToken = async refreshToken => {
    return await keytokenModel.findOne({ refreshToken })
  }
  static deleteKeyById = async userId => {
    return await keytokenModel.deleteOne({ user: userId })
  }
}
module.exports = KeyTokenService
