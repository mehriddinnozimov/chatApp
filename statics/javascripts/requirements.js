const url = "http://localhost:8000/"

function alert(type, message) {
	const alert_box = document.getElementById("alert-box")
	const alert = document.createElement("div")
	alert.classList = "alert alert-"+type
	alert.innerText = message
	alert_box.append(alert)
	setTimeout(() => {
		alert.remove()
	}, 3000)
}

function setStyleGroups(list, type, value){
	for(let i = 0; i < list.length; i++) {
		list[i].style[type] = value
	}
}

function forEachForClass(className, func){
	console.log(className)
	for(let i= 0; i < className.length; i++){
		console.log(i)
		console.log(className[i])
		func(className[i])
	}
}

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

const putData = async (uri, body) => {
	const response = await fetch(uri, {
		method: "put",
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

const uploadFile = async (uri, name, file) => {
	const formData = new FormData()
  	formData.append(name, file)
	const response = await fetch(uri, {
		method: "post",
		body: formData
	})
	return response.json()
}
