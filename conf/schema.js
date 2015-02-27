var mongoose = require('mongoose');
var mongodbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/quizEngine';
var mongodbOptions = {};
var db = mongoose.connection;
db.on('error', console.error);
var Schema = mongoose.Schema;
mongoose.set('debug', true);
mongoose.connect(mongodbURL, mongodbOptions, function (err, res){
	if(err){
		console.log('Connection refused to ' + mongodbURL);
		console.log(err);
	} else {
		console.log('Connection successful to: ' + mongodbURL);
	}
});
//user schema
var Course = new Schema({
name: String,
grade: String
});

var apply = new Schema({
	student_id: String,
	student_name:String
});
var User = new Schema({
	email: String,
	name: String,
	username: String,
	password: String,
	about: String,
	contact:String,
	state:String,
	courseReport: [Course],
	created: Number,
	location: String,
	date_birth: Date,
	sex: String,
	position: String,
	is_teacher:Boolean
	});
	
	var Subjects = new Schema({
		title: String,
		l_id:String,
		desc:String,
		course_code: String,
		lecturer: String,
		applied: [apply],
		created:Date
});

var select = new Schema({
	a:String,
	b:String,
	c:String,
	d:String
});

var questions = new Schema({
	q_no:Number,
	subject_id:String,
	title:String,
	select: [select],
	ans:String
});

var Subjects = mongoose.model('Subjects', Subjects);

var Question =

exports.subjectModel = Subjects;
exports.optionModel = mongoose.model('Options', select);
exports.question = mongoose.model('questions', questions);
//var Search = mongoose.model('elastic', Search);
exports.userModel = mongoose.model('Users', User);
//shopModel = mongoose.model('Shop', Shop);

	
