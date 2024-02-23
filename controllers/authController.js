import {dbGet, dbRun} from "../src/database.js"
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
    if (req.body.username.length < 3) {
        errors.push('Username shorter than 3 characters.')
    }
    if (errors.length > 0) {
        return res.render('register', {errors})
    }
    try {
        const row = await dbGet(`SELECT *
            FROM user
            WHERE email = ?`, [req.body.email])
        if (!row) {
            const salt = await bcrypt.genSalt()
            const hashedPasswword = await bcrypt.hash(req.body.password, salt)
            const sql = `INSERT INTO user(email, password, username) VALUES (?, ?, ?)`
            const lastID = await dbRun(sql, [req.body.email, hashedPasswword, req.body.username])
            if (lastID) {
                const token = createToken(lastID)
                res.cookie('jwt', token, {httpOnly: true, maxAge: 1000 * tokenAge, secure: true})
                res.redirect('/')
            } else {
                errors.push('User exists')
            }
        }
    } catch (err) {
        res.render('register', {errors})
    }
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
    try {
        const sql = `SELECT * FROM user WHERE email = ?`
        const row = await dbGet(sql, req.body.email)
        if (row) {
            const match = await bcrypt.compare(req.body.password, row.password);
            if (match) {
                const token = createToken(row.id);
                res.cookie('jwt', token, {httpOnly: true, maxAge: 1000 * tokenAge, secure: true});
                return res.redirect('/');
            } else {
                errors.push('Invalid email or password.');
            }
        } else {

            errors.push('Invalid email or password.');
        }
    } catch
        (e) {
        console.error(e);
        errors.push('An error occurred during login.');
    }
    res.render('login', {errors})
}

export function app_login_get(req, res, next) {
    res.render('login')
}

export function app_logout_get(req, res, next) {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
}