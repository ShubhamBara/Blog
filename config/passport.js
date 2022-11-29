const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Passmodel = require('../models/passM')



function initialize(passport, getUserByEmail) {
    const authenticateUser = async (email, password, done) => {
        const user = await Passmodel.findOne({email:email})
        // console.log(user)
        if (user == null) {
            return done(null, false, { message: "No user with the email" })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "password incorrect" })
            }

        } catch (error) {
            return done(error)
        }
        
    }
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
    passport.serializeUser((user, done) => { done(null, user.id) });

    passport.deserializeUser((id, done) => {
        return done(null, Passmodel.findOne({_id:id}))
    });
}

module.exports = initialize