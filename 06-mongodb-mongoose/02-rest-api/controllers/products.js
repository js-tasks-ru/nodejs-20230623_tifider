const Product = require('../models/Product');
const mapProduct = require('../mappers/product');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory: ObjectId(subcategory)});

  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = {products: products.map(mapProduct)};

  await next();
};

module.exports.productById = async function productById(ctx, next) {
  let {id} = ctx.params;
  let product;

  try {
    product = await Product.findById(id);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      ctx.throw(400);
    }
  }

  if (!product) ctx.throw(404);

  ctx.body = {product: mapProduct(product)};
};
