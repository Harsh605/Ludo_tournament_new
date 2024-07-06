const RoleBase = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.user_type)) {
            return next(
                res.send("only admin allow")
            )
        }
        next()
    }
}

module.exports = RoleBase