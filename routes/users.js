var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var mongoose = require('mongoose');
var subject = schema.subjectModel;
var question = schema.question;
var user = schema.userModel;
var option = schema.optionModel;
/* GET users listing. */
router.get('/applicants', function(req, res) {
  user.find({is_teacher: false}, function(err, data){
  	if(err){
  		console.log(err);
  	return res.send(500);
  		}
  		return res.json(200, data);
  });
});

router.param('subject', function(req, res, next, id){
	subject.findOne({_id: id}, function(err, data){
		if(err) {return next(err);}
		req.subject = data._id;
		req.title = data.title;
		next();
	});
});

router.param('_id', function(req, res, next, id){
	user.findById(id, function(err, data){
		if(err) {return next(err);}
		req.id = data._id;
		req.name = data.name;
		next();
	});
});

router.post('/sign_in', function(req, res){
	console.log(req.body);
	var data = req.body;
	var password = data.password;
	user.findOne({username: data.username, password:password}, function(err, data){
		if(err){
			console.log(err);
		return res.send(500);
			}
			if(!data){
				return res.send(404);
			}
		if(data === undefined || (data.password != password)){
			return res.send(401);
		}
		console.log(data);
		return res.json(200, data);
			});
});
//applied subjects for students
router.get('/user/subjects/:_id', function(req, res){
	subject.find({'applied.student_id': req.params._id}, function(err, result){
		if(err){
			console.log(err);
		res.send(500);
		return;
	}
	console.log(result);
		return res.json(200, result);
	});
});

router.post('/user/register', function(req, res) {
/*var picUrl = '';
var  path = require('path');
var  tempPath = req.files.file.path,
    targetPath = path.resolve('./uploadFiles/' + req.files.file.name);
fs.rename(tempPath, targetPath,  function (err) {
if  (err)  throw  err;
console.log("Upload complete");
picUrl = './uploadFiles/' + req.files.file.name;
});
 */var data = req.body;
 console.log(data);
  user = new user({
        name: data.name,
        email: data.email,
        username: data.username,
        password: data.password,
       contact: data.contact,
       sex: data.sex,
       state: data.state,
        dept: data.dept,
        is_teacher: false
   //   photoUrl: picUrl,
      });
      console.log(data);
      user.save(function(err, data){
      	if(err){
      		console.log(err);
      		console.log(data);
      	return res.send(500);
      	}
      	return res.json(200, data);
      });
      });
      /*router.get('/tester', function(req, res){
      	console.log(req.fies);
      });*/
router.get('/question/:question', function(req, res) {
	question.find({_id: req.params.question}, function(err, data){
		if(err){
			console.log(err);
			return res.send(500);
		}
		console.log(data);
		return res.json(200, data);
	});
});
//get questions for add questions page
router.get('/staff/question/:subject', function(req, res) {
	question.find({subject_id: req.params.subject},'_id subject_id title', function(err, data){
		if(err){
			console.log(err);
			return res.send(500);
		}
		console.log(data);
		return res.json(200, data);
	});
});


//get subjects depending on lectuerer
router.get('/subjects/:_id', function(req, res){
	subject.find({l_id:req.params._id}, function(err, result){
		if(err){
			console.log(err);
		return res.send(500);
		
			}
		return res.json(200, result);
	});
});

//student subjects available for registration
router.get('/student/subjects/:_id', function(req, res){
	subject.find({'applied.student_id':{'$ne': req.params._id}}, function(err, result){
		if(err){
			console.log(err);
		return res.send(500);
		
			}
			console.log(result);
		return res.json(200, result);
	});
});


router.get('/profile/:_id', function(req, res){
	user.findById(req.params._id, function(err, result){
		if(err){
			console.log(err);
			return res.send(500);
		}
		return res.json(200, result);
	});
});
//identify subject with suject object id(:subject)
router.put('/apply/:subject/:_id', function(req, res){
	subject.findByIdAndUpdate(req.params.subject, {$push:{"applied": {"student_id":req.params._id, "student_name":req.name}}}, function(err, result){
		if(err){
			console.log(err);
			return res.send(500);
		}
		return res.json(200, result);
	});
});

router.post('/add/subject/:_id', function(req, res){
	 console.log(req.body);
	 var subjects = new subject({
  title: req.body.title,
	 l_id: req.params._id,
	 course_code: req.body.course_code,
	 //lecturer: req.body.lecturer,
	 desc: req.body.desc,
	 created: Date.now()
});

subjects.save(function(err, data){
	if(err){
		console.log("error loading subject" + err);
	return res.send(500);
		}
	return res.json(200, data);
});
});
//admin control for staffing
router.post('/makeStaff', function(req, res){
	console.log(req.body);
	user.findByIdAndUpdate(req.body._id, {is_teacher: true}, function(err, results){
		if(err){
			console.log(err + "  " + req.body);
		return res.send(500);
			}
		console.log(results);
		res.redirect('/applicants');
	});
});
router.put('/grade/:student/:subject/:score', function(req, res){
	user.findByIdAndUpdate(req.params.student, {$push:{"courseReport": {"name": req.title, "grade":req.params.score}}}, function(err, result){
		if(err){
			console.log(err + ' ' + req.body);
			return res.send(500);
		}
		return res.send(200);
	});
});

router.get('/grade/:student', function(req, res){
	user.find({_id: req.params.student}, function(err, result){
		if(err){
			console.log(err);
			return res.send(500);
		}
		console.log(result);
		return res.json(200, result);
	});
});

router.post('/addQuestion/:subject', function(req, res){
	option  = new option({
		a:req.body.a,
		b:req.body.b,
		c:req.body.c,
		d:req.body.d
	});
	quiz = new question({
		title: req.body.title,
		subject_id: req.subject,
		select: option,
		ans:req.body.ans
	});
	quiz.save(function(err, data){
		if(err){
			console.log("error saving quesstion" + err);
			return res.send(500);
		}
		return res.json(200, data);
	});
});
module.exports = router;
