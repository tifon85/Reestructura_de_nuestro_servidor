import { Router } from "express";
import { ProductManager } from '../Dao/managers/ProductManagerMongo.js'

const router = Router();

const prodManager = new ProductManager()

//OK
router.get('/', async (req,res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    let query = req.query.query
    const sort = req.query.sort

    const params = { page, limit, query, sort }

    try{
        const products = await prodManager.getProducts(params)
        res.status(200).json({ message: "Products", products })
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//OK
router.get('/:pid', async (req,res) => {
    const pid = req.params.pid
    try{
        const product = await prodManager.getProductByID(pid)
        if(!product){
            res.status(404).json({ message: "Producto no encontrado con el id de producto indicado" })
        }else{
            res.status(200).json({ message: "Producto encontrado", product })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

router.put('/:pid', async (req,res) => {
    const pid = req.params.pid
    const prod = req.body
    try{
        const product = await prodManager.getProductByID(pid)
        if(!product){
            res.status(404).json({ message: "No se encontró el producto a actualizar" })
        }else{
            product.title = prod.title || product.title
            product.description = prod.description || product.description
            product.price = prod.price || product.price
            product.code = prod.code || product.code
            product.stock = prod.stock || product.stock
            product.category = prod.category || product.category
            product.thumbnails = prod.thumbnails || product.thumbnails
            product.status = prod.status || product.status
            await prodManager.updateProduct(pid, product)
            res.status(200).json({ message: "Producto actualizado" })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//OK
router.post('/', async (req,res) => {
    const product = req.body
    try{
        //VALIDACIONES
        if(!product.title || !product.description || !product.price || !product.category || !product.code || !product.stock){
            res.status(404).json({ message: "Todos los campos son obligatorios" })
        }
        const yaEsta = await prodManager.existProductCode(product.code)
        if(yaEsta.length == 0){
            await prodManager.addProducts(product)
            res.status(200).json({ message: "Producto agregado" })
        }else{
            res.status(404).json({ message: "Ya existe un producto registrado con ese codigo" })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

//OK
router.delete('/:pid', async (req,res) => {
    const pid = req.params.pid
    try{
        const product = await prodManager.getProductByID(pid)
        if(!product){
            res.status(404).json({ message: "Producto no encontrado con el id de producto indicado" })
        }else{
            await prodManager.deleteProduct(pid)
            res.status(200).json({ message: "Producto eliminado" })
        }
    }catch(error){
        res.status(500).json({ message: error.message })
    }
})

export default router;