logout.addEventListener("click", async () => {
	const res = await getData(url+"users/profile/logout")
	if(res.success) return window.location.reload()
	alert("danger", res.err)
})

nav_ul.addEventListener("click", (e) => {
	setStyleGroups(main.children, "display", "none")
	document.getElementById("main-"+e.target.id).style.display = "block"
})

users.addEventListener("click", async () => {
	const resUserLength = await getData("users/length")
	if(resUserLength.success) {
		usersPageLength = Math.ceil(resUserLength.length / 12)
	}
	const res = await getData("users?page="+page)
	if(res.success){
		loadUsers(res.users)
	} else {
		alert("danger", res.err)
	}
})

prev.addEventListener("click", async () => {
	prevPage()
	const res = await getData("users?page="+page)
	if(res.success){
		loadUsers(res.users)
	} else {
		alert("danger", res.err)
	}
})

next.addEventListener("click", async () => {
	nextPage()
	console.log(page)
	const res = await getData("users?page="+page)
	if(res.success){
		loadUsers(res.users)
	} else {
		alert("danger", res.err)
	}
})

save.addEventListener("click", async () => {
	const data = {
		name: name.value,
		bio: bio.value,
	}
	const res = await putData(url+"users/profile", data)
	console.log(res)
	res.success ? alert("success", "Muvaffaqiyatli o`zgartirildi") : alert("danger", res.err)
	if(file.value && file.value.length > 0) {
		const resPicture = await uploadFile(url+"users/profile/picture", "picture", file.files[0])
		resPicture.success ? alert("success", "Rasm o`zgartirildi ") : alert("danger", resPicture.err)
		file.value = ""
	}

	const resProfile = await getData(url+"users/profile")
	if(resProfile.success){
		loadProfile(resProfile.user)
	}
})

forEachForClass(user_name, (el) => {
	console.log(el)
	el.addEventListener("click", (e) => {
		const id = e.target.id.split("-")[1]
		console.log(id)
	})
})
