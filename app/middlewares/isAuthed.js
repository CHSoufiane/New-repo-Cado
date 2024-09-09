export default {
    isAuthed(req, res, next){

    if (!req.user) {
        res.status(403).json('Unauthorized');
    } else {
        next();
    }
}
}
