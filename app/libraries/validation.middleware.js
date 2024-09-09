export default (schema, reqProperty) => async (req, res, next) => {
    const userInput = req[reqProperty];
    try {
      await schema.validateAsync(userInput);
    }catch(err){
      next(err);
    }
    next();
  };