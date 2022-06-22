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

const my_members = document.getElementById("my-members")
const my_members_chat = document.getElementById("my-members-chat")

const send_div = document.getElementById("send-div")
const message_content = document.getElementById("message-content")
const send_message_button = document.getElementById("send-message")
const message_file = document.getElementById("message-file")
const remove_file = document.getElementById("remove-file")

const message_for_name = document.getElementById("message-for-name")
const message_for_bio = document.getElementById("message-for-bio")
const message_for_id = document.getElementById("message-for-id")

let page = 1
let usersPageLength = 1

let chat_users = []

let user_profile = {}

async function loader(){
	const res = await getData(url+"users/profile")
	if(res.success) {
		const profile = res.user
		user_profile = res.user
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

	forEachForClass(user_name, (el) => {
		el.addEventListener("click", (e) => {
			const id = e.target.id.split("-")[1]
			main_users.style.display = "none"
			main_chats.style.display = "block"
			console.log("load chats")
			loadChats()
			loadMessages(id)
		})
	})
}

function prevPage(){
	page--
	if(page < 1) page = 1
}

function nextPage(){
	page++
	if(page > usersPageLength) page = usersPageLength
}

const addUsersList = (user, messages) => {
	const lastMessages = messages[messages.length-1]
	const userDiv = `
		<li class="p-2 border-bottom bg-light select-user" id=${user.id}>
			<a href="#chats#${user.id}" class="d-flex justify-content-between">
			<div class="d-flex flex-row">
				<img src="${user.picture_url}" alt="avatar"
				class="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60">
				<div class="pt-1">
				<p class="fw-bold mb-0">${user.name}</p>
				<p class="small text-muted">${lastMessages.content}</p>
				</div>
			</div>
			<div class="pt-1">
				<span class="badge bg-danger float-end">1</span>
			</div>
			</a>
		</li>
	`
	my_members.innerHTML += "\n"+ userDiv

	const select_user = document.getElementsByClassName("select-user")
	forEachForClass(select_user, (el) => {
		el.addEventListener("click", async () => {
			loadMessages(el.id)
		})
	})
}

async function loadChats(){
	const profileRes = await getData(url+"users/profile")
	my_members.innerHTML = ""
	if(profileRes.success){
		const profile = profileRes.user
		const list_users = profile.list_users.reverse()
		if(list_users.length > 0){
			list_users.forEach(async (list_user) => {
				const userRes = await getData(url+"users/"+ list_user)
				const messageRes = await getData(url+"messages/"+list_user)
				if(userRes.success &&  messageRes.success){
					const user = userRes.user
					const messages = messageRes.messages
					addUsersList(user, messages)
				}
			})
		} else {
			my_members.innerHTML = "Hali yozishmalar mavjud emas"
		}
	}
}

async function loadMessages(id){
	my_members_chat.innerHTML = ""
	userRes = await getData(url+"users/"+id)
	if(userRes.success){
		user = userRes.user
		message_for_name.innerHTML = user.name
		message_for_bio.innerHTML = user.bio
		message_for_id.innerHTML = id
	}
	const messageRes = await getData("messages/"+id)
	if(messageRes.success) {
		messages = messageRes.messages
		messages.forEach(message => {
			let from_user, for_user,
			user_picture = ""
			user_profile_picture = ""
			file_link = ""
			if(message.file_url) {
				file_link = `<div><a href="${message.file_url}">Fayl</a></div>`
			}
			if(message.for == user.id){
				for_user = user
				from_user = user_profile
				user_profile_picture = `
					<img src="${user_profile.picture_url}" alt="avatar"
	                class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
				`
			} else {
				for_user = user_profile
				from_user = users
				user_picture = `
					<img src="${user.picture_url}" alt="avatar"
	            	class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="30">
				`
			}
			const messageDiv = `
				<li class="d-flex justify-content-between mb-2">
					${user_profile_picture}
			        <div class="card">
			            <div class="card-body">
				            <div class="d-flex flex-row">
				            	<div class="p-1">
				           			<a href="#messages#${message.id}" class="message-edit" id="m-${message.id}"><i class="fa-solid fa-pen text-dark"></i></a>
				           			<br>
				            		<a href="#messages#${message.id}" class="message-remove" id="m-${message.id}"><i class="fa-solid fa-trash text-danger"></i></a>
				            	</div class="p-1">
				            	<div class="mb-0 p-1">
				                	${message.content}
				                	${file_link}
				                </div>
				            </div>
			            </div>
			        </div>
			        ${user_picture}
			    </li>
			`
			my_members_chat.innerHTML += messageDiv
			send_div.style.display = "block"
		})
		const message_edit = document.getElementsByClassName("message-edit")
		const message_remove = document.getElementsByClassName("message-remove")

		forEachForClass(message_edit, (el) => {
			el.addEventListener("click", async (e) => {
				id = el.id.split("-")[1]
				const message = messages.find(message => message.id == id)
				message_content.value = message.content
			})
		})
	}
}