module.exports = (req, res, next) => {
    if (req.user.permissions.admin)
        next();
    else
        return res.status(401).send({ success: false, error: "No tienes autorización" });
};