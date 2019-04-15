const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

db.once('open',function(){
	console.log("Connected to mongodb");
});
//Check for DB errors
db.on('error',function(err){
	console.log(err);
});

let Article = require('./models/article');

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Set Public Folder
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req,res) {
	Article.find({},function(err,articles){
		if(err){
			console.log(err);
		}
		else{
			res.render('index', {
			title:'Complaints',
			articles : articles
		});
		}

		
	});
	


});

app.get('/article/:id',function(req,res){
	Article.findById(req.params.id,function(err,article){
		res.render('article',{
			article:article
		});
	});
});

app.get('/articles/add',function(req,res){
	res.render('add_article', {
		title:'Add Article'
	});
});


//Add Sumbit POST Route
app.post('/articles/add',function(req,res){
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	article.save(function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/');
		}
	});
});

app.get('/article/edit/:id',function(req,res){
	Article.findById(req.params.id,function(err,article){
		res.render('edit_article',{
			title:'Edit Article',
			article:article
		});
	});
});

app.post('/articles/edit/:id',function(req,res){
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.body;

	let query = {_id:req.params.id}

	Article.update(query,article,function(err){
		if(err){
			console.log(err);
			return;
		}
		else{
			res.redirect('/');
		}
	});
});


app.delete('article/:id',function(req,res){
	let query = {_id:req.params.id}

	Article.remove(query,function(err){
		if(err){
			consolelog(err);
		}
		res.send('Success');
	});
});

app.listen(3000,function(){
	console.log("server started on port 3000");
});