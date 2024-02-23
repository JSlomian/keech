import jwt from 'jsonwebtoken'

export default function requireAuth (req, res, next) {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'dupadupadupa', (err, decodedToken) => {
            if(err) {
                console.log(err)
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                next()
            }
        })
    } else {
        res.redirect('/login')
    }
}