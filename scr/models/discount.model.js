'use strict'

const { model, Schema } = require('mongoose') //Erase if already require
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

//Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, //percentage
    discount_value: { type: Number, required: true },
    discount_max_value: { type: Number, required: true },
    discount_code: { type: String, required: true }, // discountCode
    discount_start_date: { type: Date, required: true }, //ngay bat dau
    discount_end_date: { type: Date, required: true }, //ngay ket thuc
    discount_max_uses: { type: Number, required: true }, //so luong discount duoc ap dung
    discount_uses_count: { type: Number, required: true }, //so discount da su dung
    discount_user_used: { type: Array, default: [] }, //ai da su dung
    discount_max_uses_per_user: { type: Number, required: true }, //so luong toi da user duoc su dung
    discount_min_order_value: { type: Number, required: true },
    discount_shop_id: { type: Schema.Types.ObjectId, ref: 'Shop' },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, emun: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }, //so san phan duoc ap dung
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
)
//export the model
module.exports = model(DOCUMENT_NAME, discountSchema)
