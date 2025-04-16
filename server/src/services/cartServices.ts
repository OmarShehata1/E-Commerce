import CartModel, {  ICartItem } from "../models/cartModel";
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

interface ClearCart {
    userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => { 
    const cart = await getActiveCartForUser({ userId });
    cart.items = [];
    cart.totalAmount = 0;
    cart.status = "active";
    const updatedCart = await cart.save();
    return {data: updatedCart, statusCode: 200};
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
    
    let total = calculateCartTotalItems({ cartItems: otherItems });

    // calc total amount for the cart
    existingInCart.quantity = quantity;
    total += existingInCart.quantity * existingInCart.unitPrice;
    cart.totalAmount = total;
    const updatedCart = await cart.save();
    
    return {data: updatedCart, statusCode: 200};
}


interface deleteItemInCart {
    userId: string;
    productId: any;
}

export const deleteItemInCart = async ({ userId, productId }: deleteItemInCart) => {
    const cart = await getActiveCartForUser({ userId });
    
    const existingInCart = cart.items.find((item) => item.product.toString() === productId.toString());
    if (!existingInCart) {
        return {data :"Product not found in the cart", statusCode: 404};
    }

    const otherItems = cart.items.filter((item) => item.product.toString() !== productId.toString());
    
    let total = calculateCartTotalItems({ cartItems: otherItems });

    // remove the product from the cart
    cart.items = otherItems;

    cart.totalAmount = total;
    const updatedCart = await cart.save();
    
    return {data: updatedCart, statusCode: 200};
}


const calculateCartTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
    const total = cartItems.reduce((sum, product) => {
      sum += product.quantity * product.unitPrice;
      return sum;
    }, 0);
  
    return total;
  };