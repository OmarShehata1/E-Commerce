import CartModel from "../models/cartModel";
import ProductModel from "../models/productModel";

interface createCartForUser{
    userId: string ;
}

const createCartForUser = async ({ userId }: createCartForUser) => {
    const cart = await CartModel.create({ userId ,totalAmount: 0 });
    await cart.save();
    return cart;
}

interface getActiveCartForUser {
    userId: string;
}

export const getActiveCartForUser = async ({ userId }: getActiveCartForUser) => {
    let cart = await CartModel.findOne({ userId, status: "active" });
    
    if (!cart) {
        cart = await createCartForUser({ userId });
    }
    return cart;
}

interface addItemToCart {
    productId: any;
    quantity: number;
    userId: string;
}

export const addItemToCart = async ({ productId, quantity, userId }: addItemToCart) => {
    const cart = await getActiveCartForUser({ userId });
    
    // Check if the product already exists in the cart
    const existinCart = cart.items.find((item) => item.product.toString() === productId.toString());

    if (existinCart) {
        return {data :"Product already exists in the cart", statusCode: 400};
    }

    // Add the new product to the cart
    const product = await ProductModel.findById(productId);
    if (!product) {
        return {data :"Product not found", statusCode: 404};
    }
    if(product.stock < quantity){
        return {data :"Not enough stock", statusCode: 400};
    
    }
    cart.items.push({
        product: productId,
        unitPrice: product.price,
        quantity,
    });
    cart.totalAmount += product.price * quantity;
    const updatedCart = await cart.save();
    return {data: updatedCart, statusCode: 200};
}

interface updateItemInCart {
    productId: any;
    quantity: number;
    userId: string;
}

export const updateItemInCart = async ({ userId, productId, quantity }: addItemToCart) => {
    const cart = await getActiveCartForUser({ userId });
    
    const existingInCart = cart.items.find((item) => item.product.toString() === productId.toString());
    if (!existingInCart) {
        return {data :"Product not found in the cart", statusCode: 404};
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
        return {data :"Product not found", statusCode: 404};
    }

    if(product.stock < quantity){
        return {data :"Not enough stock", statusCode: 400};
    }
    
    const otherItems = cart.items.filter((item) => item.product.toString() !== productId.toString());
    
    let total = otherItems.reduce((sum, item) => {
        sum += item.unitPrice * item.quantity;
        return sum;
    }, 0);

    // calc total amount for the cart
    existingInCart.quantity = quantity;
    total += existingInCart.quantity * existingInCart.unitPrice;
    cart.totalAmount = total;
    const updatedCart = await cart.save();
    
    return {data: updatedCart, statusCode: 200};
}