export function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        req.loggedIn = true;
        return next();
    }

    res.redirect(`/login`);
}

export function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect(`/profile`);
    }
	next();
}
