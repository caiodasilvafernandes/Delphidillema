const express = require('express');
const app = express();
const port = 3000;
const conn = require('./database/db');
const controleUsuarios = require("./controleUsuarios/controleUsuarios");
const controleGraphs = require("./controleGraphs/graphs");
const manipulaToken = require('./controlaToken/controlaToken');

app.set("view engine", "ejs");
app.use(express.static("public"));

conn.authenticate().catch((erro) => {
    console.log(erro);
});

app.use("/", controleGraphs);
app.use("/", controleUsuarios);

app.get('/', (req, res) => {
    res.clearCookie("jwToken");
    res.render("home");
})

// _______________________Telas sobre os criadores________________________
app.get("/aboutUs", (req, res) => {
    res.render("aboutUs");
});
//________________________________________________________________________

app.listen(port);