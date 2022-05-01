const express = require('express');
const app = express();
require('dotenv').config();
const bodyparser = require("body-parser");
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI);

/* RUTAS VARIAS: */
app.use(bodyparser.urlencoded({extended: false}));
app.use("/public", express.static(__dirname + "/public"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/inicio/inicio.html");
});

/* CONSULTAS (EMAILs): */
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post("/email", (req, res) => {
    let message = {
        from: process.env.EMAIL,
        to: "nicolasrueda687@gmail.com",
        subject: "WEBMAIL: " + req.body.nombre + " " + req.body.apellido,
        html: "<p>Nombre: "+ req.body.nombre + " " + req.body.apellido + "</p><br><p>"+"Teléfono: " + req.body.telefono + "</p><br><p>Email: " + req.body.email + "</p><br><br><p>" + req.body.consulta + "</p>"
    }
    transporter.sendMail(message, function(err, info) {
        if (err) {
            res.sendFile(__dirname + "/public/mail/error.html");
            console.log(err);
        } else {
            res.sendFile(__dirname + "/public/mail/exito.html");
            console.log(info);
        }
    });
});

/* RESEÑAS (MongoDB): */
const Schema = mongoose.Schema;
const reseña_schema = new Schema ({
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    puntuacion: {type: Number, required: true},
    comentario: {type: String}
});

const Reseña = mongoose.model('Reseña', reseña_schema);

//El cliente completo el formulario y apreto el boton de enviar:
app.post("/comentario-send", function(req, res){
    let nuevaReseña = new Reseña({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        puntuacion: req.body.puntuacion,
        comentario: req.body.comentario
    });
    nuevaReseña.save(function(err, data){
        if(err){
            //res.send(err.message);
            res.sendFile(__dirname + "/public/reseñas/error.html");
            return console.error(err);
        }
        res.sendFile(__dirname + "/public/reseñas/exito.html");
    });
});

//API que devuelve todos los comentarios, para poder acceder a ellos desde el frontend:
app.get("/todos_los_comentarios", function(req,res){
    Reseña.find({}).select({log:0}).exec(function(err, data){
        if(err) return console.error(err);
        res.json(data);
    });
});
/* ----------------------------------------------------------------------------- */

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
  });
