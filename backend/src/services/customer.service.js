const Customer = require('../models/customer.model');

class CustomerService {
  async createCustomer(data) {
    const customer = new Customer(data);
    return await customer.save();
  }

  async getAllCustomers() {
    return await Customer.find().sort({ createdAt: -1 });
  }

  async getCustomerById(id) {
    return await Customer.findById(id);
  }

  async updateCustomer(id, data) {
    return await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteCustomer(id) {
    return await Customer.findByIdAndDelete(id);
  }
}

module.exports = new CustomerService();
