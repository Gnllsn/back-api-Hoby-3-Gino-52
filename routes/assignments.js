let Assignment = require('../model/assignment');
const router = require('express').Router() ; 

// Récupérer tous les assignments (GET)
function getAssignmentsSansPagination(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}

function getAssignments(req, res) {
    var aggregateQuery = Assignment.aggregate();
    
    Assignment.aggregatePaginate(aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
   }
   
// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;
    assignment.matiere = req.body.matiere;
    assignment.auteur = req.body.auteur;
    assignment.prof = req.body.prof;

    console.log(req.body);
    console.log(req.body.matiere);
    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: assignment.nom + 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}

function getAssignmentsEtudiant(req, res) {
    let columnName = 'auteur'; 
    let columnValue = req.params.auteur; 
  
    var aggregateQuery = Assignment.aggregate();
  
    aggregateQuery.match({ [columnName]: columnValue });
  
    Assignment.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
}

function getAssignmentsProf(req, res) {
    let columnName = 'prof'; 
    let columnValue = req.params.prof; 
  
    var aggregateQuery = Assignment.aggregate();
  
    aggregateQuery.match({ [columnName]: columnValue });
  
    Assignment.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, assignments) => {
        if (err) {
          res.send(err);
        }
        res.send(assignments);
      }
    );
}
  

router.get('/',getAssignments)
router.get('/prof/:prof',getAssignmentsProf)
router.get('/etudiant/:auteur',getAssignmentsEtudiant)
router.get('/:id',getAssignment)
router.post('/',postAssignment)
router.put('/',updateAssignment);
router.delete('/:id' , deleteAssignment) ; 

// module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
module.exports = router ;