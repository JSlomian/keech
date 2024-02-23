import jwt from 'jsonwebtoken'
import {db, dbGet} from "../src/database.js";

export function requireAuth (req, res, next) {
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

export async function checkUser(req, res, next) {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, 'dupadupadupa', async (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.locals.user = null
                next()
            } else {
                res.locals.user = await dbGet(`SELECT * FROM user WHERE user.id = ?`, [decodedToken.id])
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}