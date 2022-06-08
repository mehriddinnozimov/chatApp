const for_user = document.getElementsByClassName("for-user")
const for_nobody = document.getElementsByClassName("for-nobody")
const alert = document.getElementById("alert")
const tablinks = document.getElementsByClassName("tablinks")
const main = document.getElementById("main")

const profile = document.getElementById("profile")
const chats = document.getElementById("chats")
const users = document.getElementById("users")
const logout = document.getElementById("logout")

const profile_edit = document.getElementById("profile-edit")
const name = document.getElementById("name")
const email = document.getElementById("email")
const picture_url = document.getElementById("picture_url")
const bio = document.getElementById("bio")

const profile_picture = document.getElementById("profile-picture")

const postData = async (uri, body) => {
	const response = await fetch(uri, {
		method: "post",
		headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(body)
	})
	return response.json()
}

const getData = async (uri) => {
	const response = await fetch(uri, {
		method: "get"
	})
	return response.json()
}

const uri = "http://localhost:8000/"



async function loader(){
	let profile = await getData(uri + "users/profile")
	console.log(profile)
	const message = {
		color: "",
		content: ""
	}
	if(profile.success) {
		profile = profile.user
		message.color = "alert-success"
		message.content = "Tizimga muvaffaqiyatli kirdingiz!"
		for(let i=0; i < for_user.length; i++){
			for_user[i].style.display = "block"
		}
		for(let i=0; i < for_nobody.length; i++){
			for_nobody[i].style.display = "none"
		}

		profile_picture.setAttribute("src", profile.picture_url)

		for(let i = 0; i < tablinks.length; i++){
			tablinks[i].addEventListener("click", (e) => {
				for(let i  = 0; i < tablinks.length; i++) {
					tablinks[i].classList.remove("color-white")
					tablinks[i].classList.remove("active")
				}

				e.target.classList.add("color-white")
				e.target.classList.add("active")

				const mainChild = document.getElementById("for-"+e.target.id)
				console.log(mainChild)
				for(let i = 0; i < main.children.length;i++){
					main.children[i].classList.remove("d-none")
					main.children[i].style.display = "none"
				}
				mainChild.style.display = "block"
			})
		}

		name.value = profile.name
		email.value = profile.email
		bio.value = profile.bio
		let disabled = true
		profile_edit.addEventListener("click", () => {
			disabled = !disabled
			name.disabled = disabled
			bio.disabled = disabled
			picture_url.disabled = disabled
		})
	} else {
		message.color = "alert-danger"
		message.content = profile.err
		for(let i=0; i < for_user.length; i++){
			for_user[i].style.display = "none"
		}
		for(let i=0; i < for_nobody.length; i++){
			for_nobody[i].style.display = "block"
		}
	}

	alert.classList.add(message.color)
	alert.innerText = message.content

	setTimeout(() => {
		alert.style.visibility = "hidden"
	}, 3000)

	logout.addEventListener("click", async () => {
		let response = await getData(uri+"users/profile/logout")
		console.log(response)
		if(response.success) location.reload();
	})
}



loader()