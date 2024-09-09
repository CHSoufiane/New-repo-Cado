export default (err, req, res, next) => {
    console.error(err);
  
    if(err.name === 'ValidationError'){
      return res.status(400).json({error: err.details.map((detail) => detail.message)});
    }
    if(err.name === 'ApiError'){
      return res.status(err.status).json({error: err.message});
    }
  
    res.status(500).json({error: 'Internal Server error, plz contact the administrator'});
  };