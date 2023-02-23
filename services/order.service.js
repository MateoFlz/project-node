const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
class OrderService {

  constructor(){
  }

  async create(userId) {

    const { id } = await models.Customer.findOne({
      where: {
        '$user.id$': userId
      },
      include: ['user']
    });

    const data = {
      customerId: id
    }
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async findByUser(userId){
    const orders = await models.Order.findAll({
      where:{
        '$customer.user.id$': userId
      },
      include: [
        {
          association: 'customer',
          include: ['user']
        }
      ]
    });
    return orders
  }

async addItem(data){
  const newItem = await models.OrderProduct.create(data);
  return newItem;
}

  async find() {
    const orders = await models.Order.findAll({
      include: ['customer']
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [{
        association: 'customer',
        include: ['user']
      }, 'items']
    });

    if(!order) {
      throw boom.notFound('Order not found');
    }
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }

}

module.exports = OrderService;
