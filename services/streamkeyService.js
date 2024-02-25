import nmsConfig from "../configs/nms.config.js";
import md5 from 'md5'
export function genStreamkey(username) {
    const now = new Date()
    now.setMonth(now.getMonth() + 3)
    const timestamp = now.getTime()
    const hash = md5(`/live/${username}-${timestamp}-${nmsConfig.auth.secret}`)
    return `${timestamp}-${hash}`
}