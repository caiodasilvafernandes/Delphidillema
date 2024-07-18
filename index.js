const express = require('express');
const app = express();
const port = 3000;
const conn = require('./database/db');
const usuario = require("./contUsuarios/tableUsuario");
const bodyParser = require('body-parser');
const slug = require("slug");
const bCrypt = require("bcrypt");
const token = require("jsonwebtoken");
const { where } = require('sequelize');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

conn.authenticate().catch((erro) => {
    console.log(erro)
})

app.get('/', (req, res) => {
    res.render("home");
})

// ___________________________Telas de login______________________________
app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/confirmaLogin", (req, res) => {
    let { nome, senha } = req.body;


    usuario.findOne({
        where: {
            slug: slug(nome),
        }
    }).then((user) => {
        let comparaPassword = bCrypt.compareSync(senha, user.senha);
        console.log(user);

        if (comparaPassword) {
            res.redirect("/graphs");
        } else {
            res.redirect("/login");
        }
    });
});
//________________________________________________________________________


//______________________Telas de Cadastro e voto__________________________
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/cadastro", (req, res) => {
    res.render("dilemma", { info: req.body });
});

app.post("/cadDilemma", (req, res) => {
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
app.get("/edit/:id", (req, res) => {
    let id = req.params.id;

    usuario.findByPk(id).then((result) => {
        res.render("edit", { info: result });
    });
});

app.post("/update", (req, res) => {
    res.render("dilemma", { info: req.body });
})
//________________________________________________________________________

// __________________________Telas de delete______________________________
app.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    usuario.destroy({
        where:{ id:id }
    }).then(()=>{
        res.redirect("/")
    })
});

//________________________________________________________________________

// _______________________Telas sobre os criadores________________________
app.get("/aboutUs", (req, res) => {
    res.render("aboutUs");
});
//________________________________________________________________________

// ________________________Telas das informações_________________________
app.get("/graphs", (req, res) => {

    usuario.findAll().then((result)=>{
        console.log(result);
        var votosDelphi = 0;
        var votosTotais = 0;

        result.forEach((info) => {
            if(info.id){
                votosTotais++;
            }
            if(info.voto == "delphi"){
                votosDelphi++;
            }
        });

        porcentagem = (votosDelphi * 100) / votosTotais;

        var info = {
            porce:porcentagem,
            total:votosTotais
        }
        
        res.render("graphs", { info:info });
    })
});
//________________________________________________________________________

// ___________________________Telas de perfil_____________________________
app.get("/profile", (req, res) => {
    res.render("profile");
});
//________________________________________________________________________

app.listen(port);