require('dotenv/config');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
const cors = require('cors');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const routerAuth = require('./routes/authentification');
const routerAssignments = require('./routes/assignments') ; 
const routerMatiere = require('./routes/matiere') ; 

// const uri = 'mongodb+srv://mb:toto@cluster0.5e6cs7n.mongodb.net/assignments?retryWrites=true&w=majority';
const uri = 'mongodb+srv://rallisongino:mE4GqdppCkFEOjvC@assignement.sp9yzul.mongodb.net/assignments?retryWrites=true&w=majority';

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify:false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
    },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(cors());  
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// les routes
const prefix = '/api';
app.use('/auth',routerAuth.router) ; 
// app.use(prefix,routerAuth.CheckAuth) ; 
app.use(prefix + '/assignments' , routerAssignments) ; 
app.use(prefix + '/matieres',routerMatiere) ; 
  

// On démarre le serveur
let port = process.env.PORT || 8010;
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);
module.exports = app;