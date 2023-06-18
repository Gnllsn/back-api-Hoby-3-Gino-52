let mongoose = require('mongoose');
let Schema = mongoose.Schema;
// var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let MatiereSchema = Schema({
    id: Number,
    libelle: String,
    photo : String,
    profId: String
},{
    collection: 'matiere'
});

// MatiereSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// le nom de la collection (par défaut assignments) sera au pluriel, 
// soit assignments
// Si on met un nom "proche", Mongoose choisira la collection
// dont le nom est le plus proche
module.exports = mongoose.model('matiere', MatiereSchema);
