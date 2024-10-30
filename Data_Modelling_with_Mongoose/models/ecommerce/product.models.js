import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        Description : {
            type : String , 
            required : true
        } , 
        name : {
            type :String ,
            required : true
        }, 
        ProductImage : {
            type : String ,
        } ,
        Price : {
            type : Number ,
            default : 0 ,
        } ,
        stock : {
            default : 0 ,
            type : Number
        },
        category :{
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Category',
            required : true 
        } , 
        owner : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User',
        }

} , { timestamps : true }

)

export const Product = mongoose.model("Product" , ProductSchema)