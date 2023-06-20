let Matiere = require('../model/matiere');
const router = require('express').Router() ; 

// Récupérer tous les assignments (GET)
function getMatieresSansPagination(req, res){
    Matiere.find((err, matiere) => {
        if(err){
            res.send(err)
        }

        res.send(matiere);
    });
}

function getMatieres(req, res) {
    console.log("getMatieres");

    Matiere.find((error, data) => {
        if (error) {
            console.log(error);
            res.send(err);
        } else {
            console.log(data)
            res.send(data)
        }
    })

   }
   
// Récupérer un assignment par son id (GET)
function getMatiere(req, res){
    let matiereId = req.params.id;

    Matiere.findOne({id: matiereId}, (err, matiere) =>{
        if(err){res.send(err)}
        res.json(matiere);
    })
}

router.get('/',getMatieres) ; 

module.exports = router ; 
// module.exports = { getMatieresSansPagination, getMatieres, getMatiere };
