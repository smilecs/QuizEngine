var app = angular.module('quizEngine', ['ngRoute', 'ngCookies']);
app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/', {
		controller: 'loginCtrl',
		templateUrl:'/Sign in.html'
	}).when('/profile', {
		controller: 'profileCtrl',
		templateUrl: '/home.html'
	}).when('/Questionframe/:_id', {
		controller: 'questionCtrl',
		templateUrl: '/questionAdd.html'
		}).when('/profile/apply', {
		controller: 'applyCtrl',
		templateUrl: '/course_apply.html'
	}).when('/staff', {
		controller: 'staffCtrl',
		templateUrl: '/staff_section.html'
	}).when('/admin', {
		controller:'AdminCtrl',
		templateUrl: '/admin_approve.html'
	}).when('/Add', {
		controller: 'AddCtrl',
		templateUrl: '/add_subject.html'
	}).when('/quiz/:_id', {
		controller: 'nxtCtrl',
		templateUrl: '/next.html'
	}).when('/grade', {
		controller: 'results',
		templateUrl: '/grade.html'
	}).when('/quiz', {
		controller: 'quizCtrl',
		templateUrl: '/quiz.html'
	}).when('/finished', {
		controller: 'fCtrl',
		templateUrl: '/inter.html'
	}).when('/register', {
	controller: 'RegCtrl',
		templateUrl: '/register.html'
	});
}]);

app.controller('AdminCtrl', function($scope, $http){
	$scope.applicants = {};
	$http.get('/applicants').success(function(data){
		$scope.applicants = data;
	});
	$scope.approve = function(data){
		console.log(data);
		var dat = {"_id": data};
		$http.post('/makeStaff', dat).success(function(result){
			$scope.applicants = result;
		});
	};
});

app.controller('staffCtrl', function($scope, $http, $cookieStore){
	$scope.subjects = {};
	var _id = $cookieStore.get('user_id');
	$http.get('/subjects/'+_id).success(function(data){
		$scope.subjects = data;
		
	});
});

app.controller('AddCtrl', function($scope, $http, $cookieStore, $location){
	$scope.adding = function(data){
		console.log(data);
		var _id = $cookieStore.get('user_id');
		$http.post('/add/subject/'+_id, data).success(function(data, status){
			if(status === 200){
				alert("subject created");
				$location.path('/staff');
}
$scope.error = "unable to load data";
			});
	};
});

app.controller('profileCtrl', function($scope, $http, $cookieStore, $location){
	$scope.subject = {};
	if($cookieStore.get('staff') === true){
		$location.path('/staff');
	}
	var _id = $cookieStore.get('user_id');
	$http.get('/user/subjects/'+_id).success(function(data){
		$scope.subject = data;
	});
});

app.controller('RegCtrl', function($scope, $location, $http){
	$scope.addUser = function(data){
		console.log(data.name);
		$http.post('/user/register', data).success(function(data) {
			$location.path('/');
		});
	};
});

app.controller('applyCtrl', function($scope, $http, $cookieStore){
		$scope.subjects = {};
		var _id = $cookieStore.get('user_id');
		$http.get('/student/subjects/'+_id).success(function(data){
			$scope.subjects = data;
		});
		$scope.apply = function(id){
			$http.put('/apply/'+id+'/'+_id).success(function(){
		$http.get('/student/subjects/'+_id).success(function(data){
			$scope.subjects = data;
		});
				
			});
		};
			
		});
	
	app.controller('questionCtrl', function($scope, $http, $routeParams, $location){
	var id	= $routeParams._id;
		$scope.questions = {};
	$http.get('/staff/question/' + id).success(function(data){
		$scope.questions = data;
	});
	$scope.add = function(question){
		$http.post('/addQuestion/'+id, question).success(function(data){
	console.log(data);
		});
	$http.get('/staff/question/' + id).success(function(data){
		$scope.questions = data;
		});
	};
	});
	
	app.controller('nxtCtrl', function($scope, $routeParams, $location, $cookieStore, $http){
		$cookieStore.put('subject', $routeParams._id);
	console.log($routeParams._id);
	
	$http.get('/staff/question/'+$routeParams._id).success(function(data){
		//var question_no = data.lenght;
	console.log(data[0]);
	console.log(data[0].subject_id);
		$scope.no = data.length;
		var n = 0;
		$scope.title = data[0].title;
	$cookieStore.put('counter', n);
	$cookieStore.put('grade', n);
		
	});
		$scope.start = function(){
			$location.path('/quiz');
};
	});
	
	app.controller('quizCtrl',function($scope, $location, $cookieStore, $http){
		var subject_id = $cookieStore.get('subject');
		var counter = $cookieStore.get('counter');
		var q_no = '';
		$scope.quiz = {};
	 $scope.no = {};
	 var t_num = '';
	 var t_nums = '';
	 $http.get('/staff/question/'+ subject_id).success(function(data){
	 	$scope.no = data.length;
	 	t_num = data[0].length;
	 	t_nums = data.length;
	 	 q_no = data[0]._id;
	$http.get('/question/'+q_no).success(function(data){
	 		$scope.quiz = data[0];
	 		//$scope.select = quiz.select;
	 		$cookieStore.put('ans', data[0].ans);
	 		//console.log($cookieStore.get('ans'));
		
	});
	 	});

	 	$scope.next_q = function(ans){
	 		var grade = $cookieStore.get('grade');
	 		var counter = $cookieStore.get('counter');
	 		var num = '';
	 		var q_nos = '';
	 		console.log(t_nums);
	 		count = counter + 1;
	 	 	 if(count == t_nums){
	 	 var score = $cookieStore.get('grade');
		var student = $cookieStore.get('user_id');
		var subject = $cookieStore.get('subject');
		
		$http.put('/grade/'+student+'/'+subject+'/'+score).success(function(data){
	});
	 	 	$location.path('/finished');
	 	 }
	else{
	 	 $http.get('/staff/question/'+subject_id).success(function(data){
	 	 	q_nos = data[count]._id;
	 	 	console.log(q_nos);
	 	 	var check = $cookieStore.get('ans');
	 	 if(ans === check){
	 	 	grade = grade + 1;
	 	 	$cookieStore.put('grade', grade);
	 	 	}
	 	 $cookieStore.put('counter', count);
	 	  $http.get('/question/'+q_nos).success(function(data){
	 	 	
	 	 	$scope.quiz = data[0];
	 	 $cookieStore.put('ans', data[0].ans);
	 	 });
	 	 	
	 	 });

	 	 $scope.counter = count;
	 	}};
	});
	
	app.controller('fCtrl', function($http, $cookieStore){
		var student = $cookieStore.get('user_id');
		var subject = $cookieStore.get('subject');
		
	});
	
	app.controller('results', function($scope, $http, $cookieStore){
		$scope.grade = {};
		var student = $cookieStore.get('user_id');
		$http.get('/grade/'+student).success(function(data){
		console.log(data);
			$scope.grade = data;
		});
	});
	app.controller('loginCtrl', function($scope, $http, $location, $cookieStore){
		$scope.error = '';
		$scope.sign_in = function(datas){
			console.log(datas);
			$http.post('/sign_in', datas).success(function(data, status){
				var stat = parseInt(status);
							if(stat == 200){
							$cookieStore.put('user_id', data._id);
				console.log(data);
								$cookieStore.put('staff', data.is_teacher);
				console.log($cookieStore.get('staff'));
				$location.path('/profile');
							}
							else{
								$scope.error = true;
							}
			});
		};
	});