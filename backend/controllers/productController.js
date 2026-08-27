import Product from "../models/products.js";


//Create a new product
export const createProduct = async(req, res) =>{
    try{
        const newProduct = await Product.create(req.body);
        
        res.json({
            message: 'Product created successfully',
            newProduct,
        })
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
};

//Get all products

export const getProducts = async (req, res) =>{
    try{
        const{search, category} = req.query;

        let filter = {};

        if(search){
            filter.title = {$regex: search, $options: 'i'}
        }

        if(category){
            filter.category = category;
}
        const products = await Product.find(filter).sort({createdAt: -1});
        res.json(products);
    }
    catch(error){
        res.status(500).json({message: 'Server Error', error });
    }
}

//Get a single product
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

//Update a product

export const updateProduct = async (req, res) =>{
    try{
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id, req.body, {new: true}
    );
    
        res.json({
            message: 'Product updated successfully',
            updatedProduct,
        })
    }
    catch(error){
        res.status(500).json({message: 'Server Error', error });
    }
}

//Delete a product

export const deleteProduct = async (req, res) =>{
    try{
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Product deleted successfully',
            deleteProduct,
        })
    }
    catch(error){
        res.status(500).json({message: 'Server Error', error });
    }
}