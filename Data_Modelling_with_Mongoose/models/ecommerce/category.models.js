import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(

    {
        name : {
            type : String ,
            required : true
        }

    } , { timestamps : true}
)

export const Category = mongoose.model("Category" , CategorySchema)

// Note : if we uses "categories" instead of Category => MongoDb will store it same as "categories"
// But not in case of "Category" it will be stored as => "categories"