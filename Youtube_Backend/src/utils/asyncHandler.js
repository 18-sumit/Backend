// It is an wrapper where the function is passed is for the DB calls 

// 1st Approch Using Promises
const asyncHandler = (requestHandler) => {
    return (req , res , next ) => { // higherOrder function ek function return karta h lekin yaha hum func ko return hee nahi kr rahe the hence it was an error , fixed later on
        Promise
        .resolve(requestHandler(req , res , next))
        .catch( (error) => next(error) )
    }
}

export {asyncHandler}


// 2nd Approch using try catch block

// steps here :
// 1. const asyncHandler = () => {} 
// 2.const asyncHandler = (func) => () => {}
// 3. const asyncHandler = (func) => async () => {}


// const asyncHandler = (func) => async (req , res , next) => {
//     try {
        
//     } catch (error) {
//         res.error(err.code || 500)
//         .json(
//             {
//                 success : false ,
//                 message : err.message
//             }
//         )
//     }
// }