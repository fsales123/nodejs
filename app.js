const express = require('express');
const app = express();
const mysql = require('mysql');

const bodyparser = require('body-parser');
const path = require('path');

app.listen('3000', () => {
    console.log("Servidor rodando!");
});

//body Parser
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//conexao com o banco
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node'
});

db.connect(function (err) {
    if (err) {
        console.log("Nao foi possivel conectar no banco!");
    }
})

app.get('/', function (req, res) {
    let query = db.query("SELECT * FROM clientes", function (err, results) {
        res.render('index', { lista: results });
    })

});

app.get('/registrar', function (req, res) {
    res.render('cadastro', {});

});


app.post('/registrar', function (req, res) {
    //recuperando valor
    let nomeCli = req.body.nomeCli;
    let sobrenome = req.body.sobrenome;
    let empresa = req.body.empresa;
    db.query("INSERT INTO clientes (nomeCli, sobrenome, empresa) VALUES (?,?,?)", [nomeCli, sobrenome, empresa], function (err, results) { })
    res.render('cadastro', {});
});

app.post('/edit-form/:id', function(req, res) {
    var id = req.body.id;
    var sql = `SELECT * FROM clientes WHERE id=${id}`;
    db.query(sql, function(err, rows, fields) {
        res.render('editform', {title: 'Edit Product', product: rows[0]});
    });
  });

app.post('/edit/:id', function(req, res){
    let id = req.body.id;
    let nomeCli = req.body.nomeCli;
    let sobrenome = req.body.sobrenome;
    let empresa = req.body.empresa;
    let sql = 'UPDATE clientes SET nomeCli="${nomeCli}", sobrenome="${sobrenome}", empresa="${empresa}" WHERE id=${id}';
    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log('record updated!');
        
      });

});
/*
app.get('/sobre', function(req,res){
    res.render('sobre',{});
});

*/
