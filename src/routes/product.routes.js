import { Router } from "express";
import ManagerMongoDb from "../dao/ManagerMongoDb.js";

const router = Router();
const ProductManager = new ManagerMongoDb.ProductManager(); 

router.get('/', async (req,res) => {
    const {limit, page, sort, query} = req.query
    let queryList = {limit, page, sort, query}
    
    try{
        const products = await ProductManager.getProduct(queryList);
        res.send({status: 'success', products})
    }
    catch (err){
        res.status(500).send(err.message);
    }
})

router.post('/', async (req,res) => {
    const newProduct = {
        ...req.body,
      };
      try {
        const response = await ProductManager.createProduct(newProduct);
        res.send(response);
      } catch (err) {
        res.status(500).send(err.message);
      }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const product = req.body;
    try{
        const response = await ProductManager.updateProduct(id, product);
        res.send(response); 
    }
    catch (err) {
        res.status(500).send(err.message);
    }
})

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try{
        const response = await ProductManager.deleteProduct(id);
        res.send({
            message: 'Product deleted successfully',
            id: id
        })
    }
    catch(err) {
        res.status(500).send( err.message)
    }
})


export default router;