const jwt = require("jsonwebtoken");

// function verifyToken(req, res, next){
//     const header = req.headers['authorization'];
//     if (header) {
//         const token = header.split(' ')[1];
//         jwt.verify(token, process.env.SECRET, async (err, data) => {
//             if(err){
//                 res.status(403).json({ err: 'Invalid token' })
//             } 
//             else {
//                 next();
//             }
//         })
//     } else {
//         res.status(403).json({ err: 'Missing token' })
//     }
// }

function verifyToken(req,res,next){
    const header = req.headers['authorization'];
    if(header){
        try{
            const token = header.split(' ')[1];
            jwt.verify(token, process.env.SECRET);
            res.status(200)
            next();
        }catch(err){
            res.status(403).send(err);
        }
    }
}
module.exports = {verifyToken}