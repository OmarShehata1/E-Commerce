import { CartModel } from "../models/cartModel";

interface CreateCartForUser {
    userId: string;
}

const createCartForUser = async ({userId}: CreateCartForUser ) => {
    try {
        const cart = await CartModel.create({ userId , totalAmount: 0});
        await cart.save();
        return { data: cart, statusCode: 201 };
    } catch (error) {
        return { data: error, statusCode: 500 };
    }
}

interface GetActiveCartForUser {
    userId: string;
}

export const getActiveCartForUser = async ({userId}: GetActiveCartForUser) => {
    try {
        const cart = await CartModel.findOne({ userId , status: 'active' });
        if (!cart) {
            return createCartForUser({userId});
        }
        return { data: cart, statusCode: 200 };
    } catch (error) {
        return { data: error, statusCode: 500 };
    }
}

