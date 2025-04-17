import ProductModel from "../models/productModel";

export const getAllProducts = async () => {
    const products = await ProductModel.find();
    return { data: products, statusCode: 200 };
}

export const seedInitialProducts = async () => {
    try {
        const products = [
            {
                title: "Dell Inspiron 15 5515",
                image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstart-laptop.com%2Fproduct%2Fdell-inspiron-15-5515-amd-ryzen7-5700u-8core%25D8%258C-16-threads-8gb-ram-3200ghz-512gb-ssd-156-fhd%2F&psig=AOvVaw1bF2lxAPsjgDeatnsLSj4H&ust=1744787152412000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPDXwuq82YwDFQAAAAAdAAAAABAJ",
                price: 21000,
                stock: 10,
            },
            {
                title: "Dell XPS 13",
                image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dell.com%2Fen-us%2Fblog%2Fdells-new-xps-lineup-futuristic-design-with-built-in-ai%2F&psig=AOvVaw1bF2lxAPsjgDeatnsLSj4H&ust=1744787152412000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPDXwuq82YwDFQAAAAAdAAAAABAQ",
                price: 23500,
                stock: 10,
            },
            {
                title: "Dell G16",
                image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dell.com%2Fen-us%2Fshop%2Fdell-laptops%2Fg16-gaming-laptop%2Fspd%2Fg-series-16-7630-laptop&psig=AOvVaw0o_62jvO2enibqHyob12gI&ust=1744787397278000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDzq9y92YwDFQAAAAAdAAAAABAE",
                price: 32000,
                stock: 10,
            },
        ]
    
        const existingProducts = (await getAllProducts()).data;
        if (existingProducts.length === 0) {
            await ProductModel.insertMany(products);
            return { data: "Products seeded successfully", statusCode: 200 };
        }

    }catch (error) {
        console.error("Error seeding products:", error);
        return { data: "Error seeding products", statusCode: 500 };
    }
    
}