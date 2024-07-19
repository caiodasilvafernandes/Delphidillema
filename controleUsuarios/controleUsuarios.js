const express = require("express");
const router = express.Router();
const usuario = require("./tableUsuario");
const bodyParser = require('body-parser');
const slug = require("slug");
const bCrypt = require("bcrypt");
const token = require("jsonwebtoken");
const { where } = require('sequelize');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// ___________________________Telas de login______________________________
router.get("/login", (req, res) => {
    res.render("login");
})

router.post("/confirmaLogin", (req, res) => {
    let { nome, senha } = req.body;


    usuario.findOne({
        where: {
            slug: slug(nome),
        }
    }).then((user) => {
        let comparaPassword = bCrypt.compareSync(senha, user.senha);
        
        if (comparaPassword) {
            res.redirect("/graphs");
        } else {
            res.redirect("/login");
        }
    });
});
//________________________________________________________________________

//______________________Telas de Cadastro e voto__________________________
router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/cadastro", (req, res) => {
    res.render("dilemma", { info: req.body });
});

router.post("/cadDilemma", (req, res) => {
    let { tipofunc, id, nome, email, senha, vote } = req.body;

    if (tipofunc == "cad") {

        let salt = bCrypt.genSaltSync(12);
        let senhahash = bCrypt.hashSync(senha, salt);

        usuario.create({
            nome: nome,
            slug: slug(nome),
            email: email,
            senha: senhahash,
            voto: vote
        }).then(() => {
            res.redirect("/graphs");
        });

    } else {

        usuario.update({ nome: nome,slug:slug(nome), email: email, senha: senha, voto: vote }, {
            where: { id:id }
        }).then(() => {
            res.redirect("graphs");
        });
    }
});
//________________________________________________________________________

// ______________________Telas de ediçao de usuário_______________________
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;

    usuario.findByPk(id).then((result) => {
        res.render("edit", { info: result });
    });
});

router.post("/update", (req, res) => {
    res.render("dilemma", { info: req.body });
})
//________________________________________________________________________

// __________________________Telas de delete______________________________
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    usuario.destroy({
        where:{ id:id }
    }).then(()=>{
        res.redirect("/")
    })
});

//________________________________________________________________________

module.exports = router
