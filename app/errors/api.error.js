export default class ApiError extends Error {

    constructor(message, causeObj){
      super(message, causeObj);

      // We override the default error name which is 'Error'
      this.name = 'ApiError';

    // By default, we take responsibility for the error if no status is specified in the new ApiError

      
      this.status = causeObj.status || 500;
    }
  
  }