const router = require('express').Router(); 
const jwt = require('jsonwebtoken');
const User = require('../model/user') ; 
const bcrypt = require('bcryptjs');

function CheckAuth(request,response,next) {
	var token = request.headers.authorization;
	console.log("token",token)
	if(!token) return response.status(401).send({
		token : "token undefined !!!! "
	})
	// verify token secret
	try{
		token = token.split(' ')[1]; 
		jwt.verify(token,process.env.SECRET_KEY,(err,data)=>{
			if(err) return response.sendStatus(403);
			next();
		});
	}catch(err){
		console.log(err)
		return response.sendStatus(202) ;
	} 
}

function checkBody(response,user){
	if(user==null || user.name==null || user.password==null){
		return response
		.status(400)
		.send({
			status: 400 , 
			message : "Name and Password ne peuvent être null !!!" 
		});
	}
}

async function hashPassword(user){
	const salt = await bcrypt.genSalt(10) ; 
	user.password = await bcrypt.hash(user.password,salt) ;
	return user ; 
}

async function findUser(user) {
	return await User.findOne({name:user.name}) ; 
}

async function checkPassword(response,user,existant){
	const validPassword = await bcrypt.compare(user.password,existant.password)
	if(!validPassword)
	return response
	.status(200)
	.send({
		status : 400,
		message : 'Mot de passe incorrect'
	});
}

async function generateToken(user) {
	return await jwt.sign(user.name,process.env.SECRET_KEY) ; 
}

async function login(request,response){
	var user = request.body ; 
	checkBody(response,user) ; 
	const existant = await findUser(user);
	if(!existant){
		return response
		.status(200)
		.send({
			status : 400 , 
			message : "User introuvable !!!"
		});
	}
	await checkPassword(response,user,existant) ; 
	if(!response.headersSent){	
		const token = await generateToken(user)
		console.log(token)
		var result= {
			status :  200 ,
			data : {
				user : existant , 
				token : token
			} 
		} ; 
		return response.send(result) ; 
	}	
} 

async function register(request,response){
	let user = request.body ; 
	checkBody(response,user) ; 
	const existant = await findUser(user) ; 
	if(existant) {
		return response
		.status(200)
		.send({
			status : 400 , 
			message : "User déjà existant !!!" 
		})
	}
	user = await hashPassword(user) ;
	user = await new User(user).save() ; 
	const token = await generateToken(user) ; 
	delete user.password ; 
	return response.status(200)
	.send({
		status: 200 , 
		data : {
			user : user , 
			token : token
		}
	});
}

function verifyToken(request,response){
	var token = request.headers.authorization;
	if(!token) return response.sendStatus(401)
	// verify token secret
	try{
		token = token.split(' ')[1]; 
		jwt.verify(token,process.env.SECRET_KEY,(err,data)=>{
			if(err) return response.sendStatus(403);
			else{
				return response.status(200).send({status:200})
			}
		});
	}catch(err){
		console.log(err)
		return response.sendStatus(202) ;
	}
}

router.post('/login',login);
router.post('/signup',register);
router.post('/check',verifyToken);


module.exports = {
	router,
	CheckAuth 
} ; 
