import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    ProductId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Product'
    } ,
    quantity : {
        type : Number ,
        required : true
    }
})

const OrderSchema = new mongoose.Schema(
    {
        orderPrice : {
            type : Number ,
            required : true , 
        } ,
        customer : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User'
        },
        // here needed to store multiple products inside one order , so created orderItemSchema where we can store the ProdId & It's quantity
        orderItems : { 
            type : [orderItemSchema]
        } , 
        address : {
            type : String ,
            required : true 
        },
        status : {
            type : String ,
            enum : ["PENDING" , "CANCELLED" , "DELIVERED"],
            default : "PENDING"
        }

    } , { timestamps : true}

)

export const Order = mongoose.model("Order" , OrderSchema)