function goToChoice(){
	window.location.href='choise.html';
	return false;
}
function goToChoice1(){
	window.location.href='check.html';
	return false;
}

function submitNotification(){
	window.location.href='submitNotification.html';
	return false;
}

function listNotification(){
	window.location.href='listNotification.html';
	return false;
}
function ReplayNotification(){
	window.location.href='userNotification.html';
	return false;
}

function Navigate(){  
	window.location.replace('index.html');

	return false;
}
function GOto(){
	window.location.href='profile.html';
	return false;
}

function logout()
{
	localStorage.removeItem("userU");
	localStorage.removeItem("userT");

	window.location.href='index.html';
}