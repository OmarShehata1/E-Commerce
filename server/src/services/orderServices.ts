import express from 'express';
import { getActiveCartForUser } from './cartServices';
import ProductModel from '../models/productModel';
import { IOrder, IOrderItem, orderModel } from '../models/orderModule';


interface Checkout {
    userId: string;
    address: string;
}


export const checkout = async ({ userId ,address }:Checkout) => {
    
    if (!address) {
        return { data: "Address is required", statusCode: 400 };
    }
    
    const orderItems : IOrderItem[]  =[];
    const cart = await getActiveCartForUser({ userId });
    if (!cart) {
        return { data: "Cart not found", statusCode: 404 };
    }
    // loop cartItems and create orderItem
    for (const item of cart.items) {
        const product = await ProductModel.findById(item.product);

        if (!product) {
            return { data: "Product not found", statusCode: 404 };
        }


        const orderItem : IOrderItem  = {
            productTitle: product.title,
            productImage: product.image,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
    }
        orderItems.push(orderItem);
}
    // create order
    const order = {
        orderItems,
        total: cart.totalAmount,
        address,
        userId,
    };
    // save order to database
    const newOrder = await orderModel.create(order);
    await newOrder.save();
    
    cart.status = "completed";
    await cart.save();
    return { data: newOrder, statusCode: 200 };
}