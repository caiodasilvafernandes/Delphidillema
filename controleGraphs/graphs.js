const express = require("express");
const router = express.Router();
const usuario = require("../controleUsuarios/tableUsuario");
const controlaToken = require("../controlaToken/controlaToken");
const manipulaToken = new controlaToken();
const cookieParser = require("cookie-parser");

router.use(cookieParser());
router.use(express.json());

// ________________________Telas das informações_________________________
router.get("/graphs",manipulaToken.verificaToken, (req, res) => {

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

module.exports = router;