const express = require('express');
const app = express();
const port = 3000;
const conn = require('./database/db');
const usuario = require("./controleUsuarios/tableUsuario");
const controleUsuarios = require("./controleUsuarios/controleUsuarios");

app.set("view engine", "ejs");
app.use(express.static("public"));

conn.authenticate().catch((erro) => {
    console.log(erro)
})

app.get('/', (req, res) => {
    res.render("home");
})

app.use("/", controleUsuarios),

// _______________________Telas sobre os criadores________________________
app.get("/aboutUs", (req, res) => {
    res.render("aboutUs");
});
//________________________________________________________________________

// ________________________Telas das informações_________________________
app.get("/graphs", (req, res) => {

    usuario.findAll().then((result)=>{
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