import db from "../src/database.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

export async function app_register_post(req, res, next) {
    let errors = []
    if (req.body.email.length < 3) {
        errors.push('Email shorter than 3 characters.')
    }
    if (req.body.password.length < 3) {
        errors.push('Password shorter than 3 characters.')
    }
    if (errors.length > 0) {
        return res.render('register', {errors})
    }
    db.get(`SELECT *
            FROM user
            WHERE email = ?`, [req.body.email], async (err, row) => {
        if (row === undefined) {
            const salt = await bcrypt.genSalt()
            const hashedPasswword = await bcrypt.hash(req.body.password, salt)
            const sql = `INSERT INTO user(email, password)
                         VALUES (?, ?)`
            db.run(sql, [req.body.email, hashedPasswword], function (err) {
                if (err) {
                    console.log(err)
                }
                if (this.lastID) {
                    const token = createToken(this.lastID)
                    res.cookie('jwt', token, {httpOnly: true, maxAge: 1000 * tokenAge})
                    return res.redirect('/')
                }
            })
        } else {
            errors.push('User exists')
        }
        res.render('register', {errors})
    })
}

export function app_register_get(req, res, next) {
    res.render('register')
}

const tokenAge = 60 * 60 * 24 * 3
const tokenSecret = 'dupadupadupa'
const createToken = (id) => {
    return jwt.sign({id}, tokenSecret, {
        expiresIn: tokenAge
    })
}

export async function app_login_post(req, res, next) {
    let errors = []
    if (req.body.email.length < 3) {
        errors.push('Email shorter than 3 characters.')
    }
    if (req.body.password.length < 3) {
        errors.push('Password shorter than 3 characters.')
    }
    if (errors.length > 0) {
        return res.render('login', {errors})
    }
    const sql = `SELECT *
                 FROM user
                 WHERE email = ?
                   AND password = ?`
    const salt = await bcrypt.genSalt()
    const hashedPasswword = await bcrypt.hash(req.body.password, salt)
    db.get(sql, [req.body.email, hashedPasswword], (err, row) => {
        if (row === undefined) {
            errors.push('User authentication failed')
        } else {
            const token = createToken(row.id)
            res.cookie('jwt', token, {httpOnly: true, maxAge: 1000 * tokenAge})
        }
    })
    res.render('login', {errors})
}

export function app_login_get(req, res, next) {
    res.render('login')
}

export function app_logout_get(req, res, next) {

}