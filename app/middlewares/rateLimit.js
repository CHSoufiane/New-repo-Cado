import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit : 100,
    message: "You have exceeded the 100 requests in 15 minutes limit!",
})

export default limiter;