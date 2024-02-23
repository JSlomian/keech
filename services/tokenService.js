import jwt from 'jsonwebtoken'
export default function getDecodedUser(token) {
    if (token) {
        jwt.verify(token, 'dupadupadupa', (err, decodedToken) => {
            if(err) {
                console.log(err)
            } else {
                return decodedToken
            }
        })
    }
}