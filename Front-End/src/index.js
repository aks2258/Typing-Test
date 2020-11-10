let timeLimit = 60;
let timer_text = document.querySelector(".curr_time");
let input_area = document.querySelector(".input_area");
let timeLeft = timeLimit;
let timeElapsed = 0;
let reset = document.querySelector(".reset-btn");
let leader = document.querySelector(".leader");
let current_sentence = 0;
let lettersTyped = 0;
let errors = 0;
let sentence_array = [];
let sentenceIndex = 0;
let numberOfWordsPM = 0;
let lengthOfWords = 0;
let percentage = 0;
let totalWords = 0;
let totalAccurecy;
let text;
let currentUser;

document.addEventListener('DOMContentLoaded', (event) => {
    requestData()
    requestScores()
    loginSignup()
});

function requestData() {
	lengthOfWords = 0;
	fetch("http://localhost:3000/tests")
	.then(res => res.json())
	.then((text) => {
		renderData(text[current_sentence])
	})
}

function requestScores() {
  lengthOfWords = 0;
  fetch("http://localhost:3000/users")
  .then(res => res.json())
  .then((users) => {
    users = users.sort((a, b) => {
        return b.wpm - a.wpm;
    });
    users.forEach((user) => renderScore(user))
  })
}

function renderData(data) {
	let divTag = document.querySelector(".words")
	divTag.innerHTML = "";
 	let pTag = document.createElement("p")
  pTag.setAttribute("class", "test")
  pTag.innerText = data.paragraph
  divTag.append(pTag)
  sentence_array = []
	sentenceIndex = 0;
	let sentence = document.querySelector('.test').innerText;
	sentence_array = sentence.split(' ')
}

function startTest() {
	input_area.value = "";
	input_area.addEventListener("click", e => {
		let timer = setInterval(updateTimer, 1000);
	})

	reset.addEventListener("click", e => {
	    location.reload();
	})

	leader.addEventListener("click", e => {
    hideShowLeaders()
	})
}

function getInputChar() {
	current_input = input_area.value;
	let search = document.querySelector('.test').innerHTML;
	if (current_input.slice(" ") == sentence_array[sentenceIndex]) {
		let search = document.querySelector('.test').innerHTML;
		let pattern=new RegExp("("+sentence_array[sentenceIndex]+")", "gi");
  	let new_text=search.replace(pattern, "<span class='highlight'>"+sentence_array[sentenceIndex]+"</span>");
  	document.querySelector(".test").innerHTML = new_text
  	numberOfWordsPM += 1
    document.querySelector(".curr_words").innerText = numberOfWordsPM;
	} else if (current_input.endsWith(" ")) {
		  input_area.value = "";
		  sentenceIndex = sentenceIndex + 1;
		  lengthOfWords += 1;
      totalWords += 1;
      calcPercent(numberOfWordsPM, totalWords)
	} else if (current_input.slice(" ") != sentence_array[sentenceIndex]) {
		  let search = document.querySelector('.test').innerHTML;
		  let pattern=new RegExp("("+sentence_array[sentenceIndex]+")", "gi");
  	  let new_text=search.replace(pattern, "<span class='unhighlight'>"+sentence_array[sentenceIndex]+"</span>");
  	  document.querySelector(".test").innerHTML = new_text
    }

	if (lengthOfWords === sentence_array.length) {
		current_sentence += 1
		requestData()
	}
}

function calcPercent(a, n) {
  let p = a / n
  p = p * 100
  p = p.toFixed(0)
  totalAccurecy = p
  document.querySelector(".curr_accuracy").innerText = p + "%"
}

function renderScore(data) {
  let leaders = document.querySelector(".Leaderboard");
  let username = document.createElement('li')
  let score = document.createElement('li')
  let accscore = document.createElement('li')
  username.innerText = data.username
  let ulTag = document.createElement('ul');
  let liWPM = document.createElement('li').innerText = `WPM: ${data.wpm}`;
  let liACC = document.createElement('li').innerText = `Accuracy ${data.accuracy}%`;
  ulTag.append(liWPM, " ", liACC)
  leaders.append(username, ulTag)
}

function hideShowLeaders() {
  let leaders = document.querySelector(".Leaderboard");
  if (leaders.style.display === "none") {
    leaders.style.display = "inline-block";
  } else {
    leaders.style.display = "none";
  }
}

function showResults() {
  updateUserScores(currentUser)
  let listResult = document.querySelector(".results");
  let wpmResults = document.createElement("li").innerText = `WPM: ${numberOfWordsPM}`;
  let accResults = document.createElement("li").innerText = `Accuracy: ${totalAccurecy}%`
  listResult.append(wpmResults, " ", accResults)
  let windowResults = document.querySelector(".pop-up")
  windowResults.style.display = "block";
  let span = document.getElementsByClassName("close")[0];
  window.addEventListener("click", e => {
    windowResults.style.display = "none";
    location.reload();
  })
}

function updateTimer() {
	if (timeLeft > 0) {
    	timeLeft--;
    	timeElapsed++;
    	timer_text.textContent = timeLeft + "s";
	}
	else if (timeLeft === 0) {
    timeLeft = 60;
		showResults()
	}
}

function loginSignup(){
	// console.log(currentUser)
	const loginBtn = document.createElement("button")
	const loginCreateDiv = document.getElementById("login-create")
	loginCreateDiv.innerHTML = ""
	loginBtn.setAttribute("id", "login")
	loginBtn.innerText = "Log In"
	loginCreateDiv.appendChild(loginBtn)
	loginBtn.addEventListener("click", loginForm)

	const signUpBtn = document.createElement("button")
	signUpBtn.setAttribute("id", "sign-up")
	signUpBtn.innerText ="Create an Account"
	loginCreateDiv.appendChild(signUpBtn)
	signUpBtn.addEventListener("click", signUpForm)

}

function loginForm(){
	// console.log("logging in...")
	const loginCreateDiv = document.getElementById("login-create")
	loginCreateDiv.innerHTML = ""

	const title = document.createElement("h2")
	title.setAttribute("id", "title")
	title.innerHTML = "Log in <br>"
	loginCreateDiv.appendChild(title)

	const f = document.createElement("form");
	f.setAttribute("id", "log-in-form")
	f.setAttribute('method',"post");
	f.setAttribute('action',"submit");

	const usernameInput = document.createElement("input");
	usernameInput.setAttribute('type',"text");
	usernameInput.setAttribute('name',"username");
	usernameInput.setAttribute("placeholder", "Username")
  usernameInput.setAttribute("class", "username")

	const passwordInput = document.createElement("input");
	passwordInput.setAttribute('type',"password");
	passwordInput.setAttribute('name',"password");
	passwordInput.setAttribute("placeholder", "password")
  passwordInput.setAttribute("class", "password")

	const logUserIn = document.createElement("input");
	logUserIn.setAttribute('type',"submit");
	logUserIn.setAttribute('value',"Login");
  logUserIn.setAttribute("class", "login-btn")

	f.appendChild(usernameInput);
	f.appendChild(passwordInput)
	f.appendChild(logUserIn);
	loginCreateDiv.appendChild(f)

	const logInForm = document.querySelector("#log-in-form")
	logInForm.addEventListener("submit", login)

	const backBtn = document.createElement("button")
  backBtn.setAttribute("class", "back-btn")
	backBtn.innerText = "Back"
	backBtn.addEventListener("click", loginSignup)
	loginCreateDiv.appendChild(backBtn)

}

function login(e){
	e.preventDefault()
	// console.log(e.target.username.value)
	const username = e.target.username.value
	const password = e.target.password.value

	fetch("http://localhost:3000/users")
	.then(response => response.json())
	.then((users) => {
		// console.log(users)
		users.find(user => {
			if (user.username === username && user.password === password ){
				currentUser = user.id
				return findUser(currentUser)
			} else {
				//alert("User not found. Please try again.")
				loginForm
			}
		});
	})
}

function findUser(currentUser){
	fetch(`http://localhost:3000/users/${currentUser}`)
    .then(res => res.json())
    .then(user => loggedInView(user))
	}

function loggedInView(user){
	console.log(user)
	const loginCreate = document.getElementById('login-create')
	const logOutBtn = document.createElement("button")
	const deleteAccountBtn = document.createElement("button")
	deleteAccountBtn.innerText = "Delete Account"
	logOutBtn.innerText = "Log Out"
	logOutBtn.addEventListener("click", (ev) => {
		currentUser = "Nil"
		// console.log(currentUser)
		loginSignup()
	})

	loginCreate.innerHTML = `<h3>Welcome ${user.username}!</h3> </br>`
	loginCreate.appendChild(logOutBtn)
	loginCreate.appendChild(deleteAccountBtn)
	deleteAccountBtn.addEventListener("click", deleteAccount)
}

function deleteAccount(e){
	e.preventDefault
	let configObj = {
		method: "DELETE",
	  };
	  fetch(`http://localhost:3000/users/${currentUser}`, configObj)
	  .then(r => r.json())
	  .then(loginSignup)
	.catch((err)=>console.error(err))
}

function signUpForm(){
	// console.log("Signing up...")
	const loginCreateDiv = document.getElementById("login-create")
	loginCreateDiv.innerHTML = ""


	const title = document.createElement("h2")
	title.setAttribute("id", "title")
	title.innerHTML = "Create an Account <br>"
	loginCreateDiv.appendChild(title)

	const f = document.createElement("form");
	f.setAttribute("id", "sign-up-form")
	f.setAttribute('method',"post");
	f.setAttribute('action',"submit");

	const usernameInput = document.createElement("input");
	usernameInput.setAttribute('type',"text");
	usernameInput.setAttribute('name',"username");
	usernameInput.setAttribute("placeholder", "Username")

	const passwordInput = document.createElement("input");
	passwordInput.setAttribute('type',"password");
	passwordInput.setAttribute('name',"password");
	passwordInput.setAttribute("placeholder", "password")

	const s = document.createElement("input");
	s.setAttribute('type',"submit");
	s.setAttribute('value',"Submit");
  s.setAttribute("class", "submit-btn")

	f.appendChild(usernameInput);
	f.appendChild(passwordInput)
	f.appendChild(s);
	loginCreateDiv.appendChild(f)

	const logInForm = document.querySelector("#sign-up-form")
	logInForm.addEventListener("submit", signUp)

	const backBtn = document.createElement("button")
	backBtn.innerText = "Back"
	backBtn.addEventListener("click", loginSignup)
	loginCreateDiv.appendChild(backBtn)
}

function signUp(e){
	e.preventDefault()
	const username = e.target.username.value
	const password = e.target.password.value

	fetch("http://localhost:3000/users", {
		method: "POST",
        headers: {
			"content-type": "application/json",
			"accept": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
	})
	.then(loginForm)
	// .then(res => res.json())
	// .then(res => console.log(res))

}

function updateUserScores(id) {
  fetch(`http://localhost:3000/users/${id}`, {
    method : "put",
      headers: {
        "content-type": "application/json",
  			"accept": "application/json"
      },
      body: JSON.stringify({
        wpm: numberOfWordsPM,
        accuracy: totalAccurecy
      })
  })
}

startTest()
