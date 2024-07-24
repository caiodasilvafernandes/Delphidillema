const jwt = require("jsonwebtoken");
const secret = "delphiDillema";

class manipulaToken {
    criaToken(id, req, res) {
        const token = jwt.sign({ userId: id }, secret, { expiresIn: 120 });
        res.cookie("jwToken", token, { maxAge: 1440000, httpOnly: false,overwrite: true });
        return token;
    }

    verificaToken(req, res, next) {
        const verificaToken = req.cookies["jwToken"];

        if (!verificaToken) {
            res.redirect("/noLogin");
        }

        jwt.verify(verificaToken, secret, (err, decoded) => {
            if (err) {
                res.redirect("/noLogin");
            }
            req.userId = decoded.userId;
            next();
        });
    }
}

module.exports = manipulaToken;