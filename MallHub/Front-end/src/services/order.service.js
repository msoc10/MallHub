import BaseService from "./base.service";

class OrderService extends BaseService {
    constructor() {
        super('')
    }

    async Pay(input, config) {
        const data = await this.post('payment/process/', input, config);
        return data;
    }

    async getProductById(id) {
        const { data } = await this.get(`products/${id}/`);
        return data.product;
    }

    async getCustomerOrder() {
        const { data } = await this.get('payment/order-status/');
        return data.order_status;
    }

    async getDeliveryOrder() {
        const { data } = await this.get('delivery/orders/');
        return data.orders;
    }

    async updateOrderStatus({ id, status }) {
        const { data } = await this.put(`delivery/orders/${id}/status/`, { status });
        return data.order_status;
    }
}

const instance = new OrderService();
export { instance as OrderService };