const for_user = document.getElementsByClassName("for-user")
const for_nobody = document.getElementsByClassName("for-nobody")
const main = document.getElementById("main")

const logout = document.getElementById("logout")
const nav_ul = document.getElementById("nav-ul")

const profile = document.getElementById("profile")
const users = document.getElementById("users")
const chats = document.getElementById("chats")

const main_users = document.getElementById("main-users")
const main_chats = document.getElementById("main-chats")
const main_profile = document.getElementById("main-profile")

const main_users_row = document.getElementById("main-users-row")

const name_view = document.getElementById("name-view")
const picture_view = document.getElementById("picture-view")
const bio_view = document.getElementById("bio-view")
const email_view = document.getElementById("email-view")

const name = document.getElementById("name")
const bio = document.getElementById("bio")
const file = document.getElementById("file")
const save = document.getElementById("save")

const prev = document.getElementById("prev")
const next = document.getElementById("next")

const user_name = document.getElementsByClassName("user-name")

let page = 1
let usersPageLength = 1

async function loader(){
	const res = await getData(url+"users/profile")
	console.log(res)
	if(res.success) {
		const profile = res.user
		alert("success", "Tizimga xush kelibsiz, " + profile.name)
		setStyleGroups(for_user, "display", "block")
		setStyleGroups(for_nobody, "display", "none")

		main_users.style.display = "none"
		main_chats.style.display = "none"

		loadProfile(res.user)

	} else {
		alert("danger", res.err)
		setStyleGroups(for_user, "display", "none")
		setStyleGroups(for_nobody, "display", "block")
	}
}

loader()

function loadProfile(profile){
	name_view.innerText = profile.name
	picture_view.setAttribute("src", profile.picture_url)
	bio_view.innerText = profile.bio
	email_view.innerText = profile.email

	name.value = profile.name
	bio.value = profile.bio
}

function loadUsers(users){
	let col = ""
	if(users.length < 10) col = "-2"
	const usersList = []
	for(let i = 0; i < users.length; i++) {
		const user = users[i]
		const userDiv = `
			<div class="col${col} mb-2">
				<div class="card p-1" style="width: 10rem;">
					<img src="${user.picture_url}" class="card-img-top" alt="Foydalanuvchining rasmi">
					<div class="card-body">
	        			<a class="card-title h6 user-name link-primary" href="#users#${user.id}" id="n-${user.id}">${user.name}</a>
	        			<p class="card-text">${user.bio}</p>
	        		</div>
	    		</div>
	    	</div>
    	`
    	usersList.push(userDiv)
	}
	main_users_row.innerHTML = usersList.join("\n")
}

function prevPage(){
	page--
	if(page < 1) page = 1
}

function nextPage(){
	page++
	if(page > usersPageLength) page = usersPageLength
}