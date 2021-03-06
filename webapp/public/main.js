
var loginContainerID = "#loginContainer";
var homeContainerID = "#homeContainer";
var chatContainerID = "#chatContainer";
var addEventContainerID = "#addEventContainer";
var inviteContainerID = "#inviteContainer";

var navigationStack = [loginContainerID];

function setupPage() {
	layoutNavigationStack();
}

// ************************************   Layout Functions   ************************************

function layoutNavigationStack() {
	var topContainerID = navigationStack[navigationStack.length-1];
	$(topContainerID).show();
	
	for (int index = 0; index < navigationStack.length; index++) {
		var containerID = navigationStack[index];
		placeContainer(containerID, index);
	}
}
function placeContainer(containerID, index) {
	var currentIndex = navigationStack.length-1;
	var offset = -$(window).width() * (currentIndex - index);
	$(containerID).css({top: 0, left: offset});
}
function goBack() {
	navigationStack.remove(navigationStack.length-1);
	layoutNavigationStack();
}


// ************************************   Login Page   ************************************

var braceletCodeField = "#braceletCodeField";

function login() {
	var braceletCode = $(braceletCodeField).val();
	
	//check code
	
	loginSuccess();
}
function loginSuccess() {
	navigationStack.push(homeContainerID);
	layoutNavigationStack();
}


// ************************************   Home Page   ************************************


function showChat() {
	navigationStack.push(chatContainerID);
	layoutNavigationStack();
}

function showAddEvent() {
	navigationStack.push(addEventContainerID);
	layoutNavigationStack();
}

function showInviteFriend() {
	navigationStack.push(inviteContainerID);
	layoutNavigationStack();
}


// ************************************   Chat Room   ************************************

var socket = io.connect('http://localhost:8080');
var displayMessage=""; //string of messages

socket.on('messages', function (data){
	//alert(data.alertBox);
});
socket.on('submission', function (data){
	displayMessage += data.clientName + " : "+data.content + "<br>";
	display();
	// console.log(data);
	//alert(data.content);
});
socket.on('getOthersNames', function (data){
	displayMessage += "Available users: " + data.list + "<br>";
	display();
	// console.log(data);
});

function setClientName() {

	var nickName = document.getElementsByName("Nickname")[0].value;
	socket.emit('setClientName', nickName);

	hideNameForm();
	showChatRoom();

}
function hideNameForm() {
	$('#formcontainer').show();
}
function display() {
	$('#chatbox').html(displayMessage);
}
function showChatRoom() {
	document.getElementById("chatroom").style.display="block";
	var nickName = document.getElementsByName("Nickname")[0].value;
	displayMessage = nickName + " has joined the chatroom" + "<br>";
	socket.emit('getOthersNames');
	display();
}
function clientMessage() {
	var thisMessage = document.getElementsByName("messageContent")[0].value;
	var username = document.getElementsByName("Nickname")[0].value;

	socket.emit('submission', thisMessage);
	document.getElementsByName("messageContent")[0].value ="";
	displayMessage += username + " : "+ thisMessage + "<br>";
	display();
}


