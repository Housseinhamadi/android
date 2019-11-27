var firebaseConfig = {
	apiKey: "AIzaSyBJ3XsVrtp1sSAMMRVh5Op_1AuKga_14Rk",
	authDomain: "senior-project-c0ab7.firebaseapp.com",
	databaseURL: "https://senior-project-c0ab7.firebaseio.com",
	projectId: "senior-project-c0ab7",
	storageBucket: "",
	messagingSenderId: "961044426711",
	appId: "1:961044426711:web:f70c19c6041815f4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var API_KEY = "AIzaSyBJ3XsVrtp1sSAMMRVh5Op_1AuKga_14Rk";

var users = firebase.database().ref('users');
var technicals = firebase.database().ref('technicals');
var messages = firebase.database().ref('messages');

document.getElementById('signUpForm').addEventListener('submit', signUp);
document.getElementById('signInForm').addEventListener('submit', signIn);


function signIn(e) {
	e.preventDefault();
	var email = getInputValue('email');
	var password = getInputValue('password');

	firebase.auth().signInWithEmailAndPassword(email, password).then(function(){

		//window.location.href = "home.html";
		technicals.child(email.replace('.',',')).once('value', function(snapshot) {
			var user1=JSON.stringify(snapshot.val());
			localStorage.setItem("userT",user1);
			console.log(user1);
			if(user1 != "null" && user1 != undefined && user1 !=null)
				window.location.href="listNotification.html";
		});
		users.child(email.replace('.',',')).once('value', function(snapshot) {
			var user=JSON.stringify(snapshot.val());
			localStorage.setItem("userU",user);
			if(user != "null" && user != undefined && user !=null)
				window.location.href="home.html";			
		});

	}).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);

    });

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			//console.log('user', user);
		}
	})

}

function signUp(e) {

	e.preventDefault();
	var token = getInputValue('token');
	var userName = getInputValue('username');
	var email = getInputValue('emailSignUp');
	var phoneNumber = getInputValue('phoneNumber');
	var password = getInputValue('passwordSignUp');
	var type = getInputValue('mySelect');
	var X = getInputValue('X');
	var Y = getInputValue('Y');
	console.log(X);
	console.log(Y);

	var x=0;
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(u){
		if (document.getElementById('userRadio').checked) {
			addUsers(userName, email, phoneNumber, password, token);
		} else {

			addTechnical(type, X, Y, token, userName, email, phoneNumber, password);
		}
	}).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        alert( errorMessage);

        
        // ...
    });

	

}
function getInputValue(id) {
	return document.getElementById(id).value;
}

function addUsers(username, email, phone, password, token) {
	var user = users;
	newEmail=email.replace('.',',');
	user.child(newEmail).set({
		token: token,
		userName: username,
		email: email,
		phone: phone,
		password: password
	});
	window.location.href = "index.html";
}

/*function getXandY() {
	var queryString = decodeURIComponent(window.location.search);
	queryString = queryString.substring(1);
	var locations = queryString.split("&");
	var x = locations[0];
	var y = locations[1];

	return {
		X: x,
		Y: y
	}
}*/

function addTechnical(type, x, y, token, username, email, phone, password) {
	var user = technicals;

	newEmail=email.replace('.',',');
	user.child(newEmail).set({
		type: type,
		X: x,
		Y: y,
		token: token,
		userName: username,
		email: email,
		phone: phone,
		password: password
	});
	window.location.href = "index.html";
}

function sendUserNotification(user,lat,lng,type)
{
	user=JSON.parse(user);
	
	user['lat']=lat;
	user['lng']=lng;
	user['type']=type;
	user['to']="tech";
	console.log(user);
	messages.push().set(user);

	alert("notification sent");

}

function sendTechNotification(user,data)
{
	
	user['to']="user";
	user['data']=data;
	messages.push().set(user);
	technicals.once('value', function(snapshot) {

		var technicals1=JSON.parse(JSON.stringify(snapshot.val()));
		console.log(technicals1);

		for(var key in technicals1)
		{ 
			var value=technicals1[key];
			alert(key);
			var subNot =JSON.parse(localStorage.getItem("submitted"));
			subNot[data.id]=data;
			localStorage.setItem("submitted",JSON.stringify(subNot));

			technicals.child(key).child("notifications").child(data.id).remove();

		}
	});

	alert("notification sent");
	window.location.href = "listNotification.html";

}

function sendNotificationToUser(token, message, onSuccess) {
	request({
		url: 'https://fcm.googleapis.com/fcm/send',
		method: 'POST',
		headers: {
			'Content-Type': ' application/json',
			'Authorization': 'key=' + API_KEY
		},
		body: JSON.stringify({
			notification: {
				title: message
			},
			to: '/topics/user_' + token
		})
	}, function (error, response, body) {
		if (error) { console.error(error); }
		else if (response.statusCode >= 400) {
			console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage);
		}
		else {
			onSuccess();
		}
	});
}


// function sendNotification(value, token) {
//     var message = messages.push();
//     message.set({
//         key: token,
//         value: value
//     })
// }

function sendNotificationForAllMechanical(e) {
	e.preventDefault();


	return technicals.on('child_added', function (technicals) {
		technicals.forEach(function (technical) {
			var childData = technical.val();
			if (childData.type === 'Mechanical') {
				var message = 'I have a problem I am In' + +'and my phone number is' +
				sendNotification(childData.token, message, function () {
					messages.ref.remove();
				});
			}
		}, function(error){
			console.log(error);
		});
	});
}

// function getAllMechanical(e, location) {
//     e.preventDefault();
//     technicals.on('value', function (technicals) {
//         technicals.forEach(function (technical) {
//             var childData = technical.val();
//             if(childData.)
// }