const Order = require('../models/orders.model');
const Product = require('../models/products.model');
const Customer = require('../models/customer.model');

class OrderService {
  async createOrder(data) {
    const { customerId, productId, quantity } = data;

    // 1. Verify customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // 2. Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      throw new Error('Quantity must be a positive integer');
    }

    // 3. Verify stock availability
    if (product.stock < qty) {
      throw new Error(`Insufficient stock. Available: ${product.stock}`);
    }

    // 4. Calculate total amount
    const totalAmount = product.price * qty;

    // 5. Deduct stock from product
    product.stock -= qty;
    await product.save();

    // 6. Create and save order
    const order = new Order({
      customerId,
      productId,
      quantity: qty,
      totalAmount
    });

    return await order.save();
  }

  async getAllOrders() {
    return await Order.find()
      .populate('customerId', 'name email phone')
      .populate('productId', 'productName price stock')
      .sort({ createdAt: -1 });
  }

  async getOrderById(id) {
    return await Order.findById(id)
      .populate('customerId', 'name email phone')
      .populate('productId', 'productName price stock');
  }

  async updateOrder(id, data) {
    const { customerId, productId, quantity } = data;

    const oldOrder = await Order.findById(id);
    if (!oldOrder) {
      throw new Error('Order not found');
    }

    const customer = await Customer.findById(customerId || oldOrder.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const newProductId = productId || oldOrder.productId;
    const newQuantity = quantity !== undefined ? parseInt(quantity, 10) : oldOrder.quantity;

    if (isNaN(newQuantity) || newQuantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }

    const product = await Product.findById(newProductId);
    if (!product) {
      throw new Error('Product not found');
    }

    // If product or quantity changed, recalculate stock and totalAmount
    let totalAmount = oldOrder.totalAmount;

    // We simulate reverting the old order stock first
    const oldProduct = await Product.findById(oldOrder.productId);
    if (oldProduct) {
      oldProduct.stock += oldOrder.quantity;
    }

    // Check if the target product has enough stock after reverting the old stock
    if (oldOrder.productId.toString() === newProductId.toString()) {
      // Same product, check stock in the modified oldProduct instance
      if (oldProduct.stock < newQuantity) {
        throw new Error(`Insufficient stock. Available: ${oldProduct.stock}`);
      }
      oldProduct.stock -= newQuantity;
      totalAmount = oldProduct.price * newQuantity;
      await oldProduct.save();
    } else {
      // Different product, check stock in the new product, and also save the reverted old product
      if (product.stock < newQuantity) {
        throw new Error(`Insufficient stock. Available: ${product.stock}`);
      }
      if (oldProduct) {
        await oldProduct.save();
      }
      product.stock -= newQuantity;
      totalAmount = product.price * newQuantity;
      await product.save();
    }

    oldOrder.customerId = customerId || oldOrder.customerId;
    oldOrder.productId = newProductId;
    oldOrder.quantity = newQuantity;
    oldOrder.totalAmount = totalAmount;

    return await oldOrder.save();
  }

  async deleteOrder(id) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    // Revert the stock when order is deleted
    const product = await Product.findById(order.productId);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    return await Order.findByIdAndDelete(id);
  }
}

module.exports = new OrderService();
