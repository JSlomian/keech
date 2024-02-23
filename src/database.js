import sqlite3 from "sqlite3";
import {promisify} from "util";

export const db = new sqlite3.Database('./main.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.log(err.message)
    }
})

export const dbGet = promisify(db.get).bind(db);

export function dbRun(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                // Resolve with lastID from the context of the callback
                resolve(this.lastID);
            }
        });
    });
}