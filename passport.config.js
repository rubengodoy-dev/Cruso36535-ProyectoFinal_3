const passport = require('passport')
const local = require('passport-local')
const users = require('./models/user')
const { createHash, isValidPassword } = require('./utils/utils')

const { createLogger } = require('./utils/logger')
const logger = createLogger()

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            { passReqToCallback: true },
            async (req, username, password, done) => {
                try {
                    let user = await users.findOne({ username })
                    if (user) return done(null, false)
                    const newUser = {
                        username,
                        password: createHash(password),
                        nombre: req.body.nombre,
                        direccion: req.body.direccion,
                        edad: req.body.edad,
                        telefono: req.body.telefono,
                        foto: req.body.foto,
                        carritoId: 0
                    }
                    try {
                        let result = await users.create(newUser)
                        return done(null, result)
                    } catch (err) {
                         logger.error(err.message)
                        done(err)
                    }
                } catch (err) {
                    logger.error(err.message)
                    done(err)
                }
            }
        )
    )

    passport.use(
        'login',
        new LocalStrategy(
            async (username, password, done) => {
                try {
                    let user = await users.findOne({ username })
                    if (!user) return done(null, false, { message: "User does not exists" })
                    if (!isValidPassword(user, password)) return done(null, false, { message: "Invalid password" })
                    return done(null, user)
                } catch (err) {
                    logger.error(err.message)
                    done(err)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((id, done) => {
        users.findById(id, done)
    })
}


module.exports = { initializePassport }