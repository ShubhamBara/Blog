module.exports = {
    ensureAuthenticate : function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();

        }
        res.redirect('/admin/login')

    },
    isNotAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/admin/post');

        }
        next()

    }
}