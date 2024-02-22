export function register_post(req, res, next) {
    let errors = []
    if (req.body.email.length < 3) {
        errors.push('Email shorter than 3 characters.')
    }
    if (req.body.password.length < 3) {
        errors.push('Password shorter than 3 characters.')
    }
    if (errors.length > 0) {
        res.render('register', {errors})
    }
    db.get(`SELECT * FROM user WHERE email = ?`, [req.body.email], (err, row) => {
        if (row === undefined) {
            db.run(`INSERT INTO user(email, password) VALUES(?,?)`, [req.body.email, req.body.password], function (err) {
                if (err) {
                    console.log(err)
                }
                if (this.lastID) {
                    return res.redirect('/')
                }
            })
        } else {
            errors.push('User exists')
        }
        res.render('register', {errors})
    })
}
export function register_get(req, res, next) {
    res.render('register')
}