// It is an wrapper where the function is passed is for the DB calls 

// 1st Approch Using Promises
const asyncHandler = (requestHandler) => {
    (req , res , next ) => {
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