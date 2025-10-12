const asyncHandler = (requestHandler) => {

  return (req, res , next)=>{
    Promise.resolve(requestHandler())
    .catch((error)=>{next(error)})
  }
}

export {asyncHandler}


//Another way to write same code using try catch 

// const asyncHandler = (funtion) => async (req, res , next) => {
//   try {
    
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// } 