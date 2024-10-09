


async function login(event) {
    event.preventDefault()


    let email = document.getElementById('email').value
    console.log("email", email);

    let password = document.getElementById('password').value;
    console.log('password', password);

    let data = {
        email,
        password
    };
    console.log("data : ", data);

    let strdata = JSON.stringify(data);
    console.log("strdata", strdata);


    try {
        let response = await fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: strdata
        })
        console.log("response", response)

        let parsed_Response = await response.json();
        console.log("parsed_Response", parsed_Response);

        let token_data = parsed_Response.data;
        console.log("token_data", token_data);

        let token = token_data.token;
        console.log('token', token);

        let id = token_data.id;
        console.log("id", id);

        let user_type = token_data.user_type;
        console.log("user_type : ", user_type);

        let token_key = id

        localStorage.setItem(token_key, token);


        if (user_type === "Admin") {
            window.location = `admin.html?login=${token_key}`,
                alert("admin logging succesfull")
        }
        else if (user_type === "Employee") {
            window.location = `employee.html?login=${token_key}&id=${id}`
            alert("employee logging succesfull")
        }
    } catch (error) {
        console.log("error", error)
    }
}

async function getAllUsers() {

    let params = new URLSearchParams(window.location.search);
    console.log("params : ", params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    let token = localStorage.getItem(token_key)
    console.log("token", token);



    try {
        let response = await fetch(`/getAllData`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        let parsed_Response = await response.json();
        console.log("parsed_response", parsed_Response);

        let data = parsed_Response.data;
        console.log('data', data);

        let allUsersContainer = document.getElementById('userTable');

        let users = '';

        for (i = 0; i < data.length; i++) {
            users += `
           <tr class="hov">

                    <td class="hov">${data[i]._id}</td>
                    <td class="hov">${data[i].name}</td>
                    <td class="hov">${data[i].email}</td>
                    <td class="hov">${data[i].phone}</td>
                    <td class="hov">${data[i].age}</td>

                    


                    <td><button class="custom-btn btn-16" onclick="singleUser('${data[i]._id}')" >view</button></td>
                    <td><i class="fa fa-pencil-square-o"  onclick="updateClick('${data[i]._id}')" style="font-size:30px" ></i></td>
                    <td><i class="fa fa-trash" onclick="deleteClick('${data[i]._id}')" style='font-size:30px;color:red'></i></td>
                </tr>

            `

            allUsersContainer.innerHTML = users;
        }





    } catch (error) {
        console.log("error", error);
    }
}

function addPage() {

    let params = new URLSearchParams(window.location.search);
    console.log("params : ", params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    window.location = `add-user.html?login=${token_key}`
}

async function addUser(event) {

    event.preventDefault()
    let params = new URLSearchParams(window.location.search);
    console.log("params : ", params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    let token = localStorage.getItem(token_key)
    console.log("token", token);

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    // let password = document.getElementById('password').value;
    let user_type = document.getElementById('usertype').value;
    let phone = document.getElementById('phone').value
    let age = document.getElementById('age').value

    let datas = {
        name,
        email,
       
        user_type,
        phone,
        age
    };
    console.log('datas', datas);

    let strdata = JSON.stringify(datas);
    console.log("strdata", strdata);







    try {
        let response = await fetch(`/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: strdata
        })

        if(response.status === 200){
            alert('User added succesfully')
            window.location = `admin.html?login=${token_key}`
        }
        else{
            alert('Something went wrong')
        }



    } catch (error) {
        console.log("error", error);
    }
}


function singleUser(id) {

    let params = new URLSearchParams(window.location.search);
    console.log("params : ", params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    window.location = `view-user.html?id=${id}&login=${token_key}`
}

async function singleUserData() {
    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id');
    console.log("id", id)

    let token_key = params.get('login');
    console.log("token_key", token_key);


    let token = localStorage.getItem(token_key)
    console.log("token", token);

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("response", response)

        let parsed_Response = await response.json()
        console.log("parsed_Response", parsed_Response);

        let data = parsed_Response.data
        console.log("data", data);

        let singleUserContainer = document.getElementById('singleUserContainer');

        let singleUser = `
        <div>Name: ${data.name}</div>
        <div>Email: ${data.email}</div>
        <div>Age: ${data.age}</div>
        <div>Phone: ${data.phone}</div>




      

        `
        singleUserContainer.innerHTML = singleUser
    } catch (error) {

    }


}

function updateClick(id) {


    let params = new URLSearchParams(window.location.search);
    console.log("params : ", params);

    let token_key = params.get('login');
    console.log("token_key", token_key);

    window.location = `update-User.html?id=${id}&login=${token_key}`
}

async function loadData() {
    let name = document.getElementById('name')
   let user_type = document.getElementById('usertype')
    let email = document.getElementById('email');
    let phone = document.getElementById('phone')
    let age = document.getElementById('age')
    


    let params = new URLSearchParams(window.location.search);
    console.log('params', params);

    let id = params.get('id');
    console.log("id", id);

    let token_key = params.get('login');
    console.log("token_key", token_key);
    let token = localStorage.getItem(token_key)

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("response", response)

        let parsed_Response = await response.json()
        console.log("parsed_Response", parsed_Response);

        let data = parsed_Response.data
        console.log("data", data);

        name.value = data.name;
        email.value = data.email
        user_type.value = data.userType.user_type
        phone.value = data.phone
        age.value = data.age



    } catch (error) {
        console.log("error",error)
    }




}

async function updateData(event){
    event.preventDefault()
    let params = new URLSearchParams(window.location.search);
    console.log("params",params);


    let id = params.get('id');
    console.log("id form updatdata",id);
    let token_key = params.get('login');
    console.log("token_key",token_key)

    let token = localStorage.getItem(token_key);
    console.log("token",token);

    let name = document.getElementById('name').value;
    let user_type = document.getElementById('usertype').value
    let email = document.getElementById('email').value
    let phone = document.getElementById('phone').value
    let age = document.getElementById('age').value

    let data = {
        name,
        user_type,
        email,
        phone,
        age
    };
    console.log("dataa",data);

    let strdata = JSON.stringify(data);
    console.log("strdata",strdata)


    try {
        let response = await fetch(`/user/${id}`,{
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body : strdata
        });

        console.log("response",response);
    } catch (error) {
        console.log("error",error);
    }
}

async function deleteClick(id){
   
    console.log("id",id)
    let params = new URLSearchParams(window.location.search);
    console.log("params",params)

    let token_key = params.get('login');
    console.log("tokenkey",token_key)

    let token = localStorage.getItem(token_key);
    console.log("token",token)

    try {
        let response = await fetch(`/user/${id}`,{
            method : 'DELETE',
            headers : { 
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("response",response)

        if(response.status === 200){
            alert('deletion succesfull');
            window.location = `admin.html?login=${token_key}`
        }
        else{
            alert('deletion failed')
        }
    } catch (error) {
        console.log('error',error);
    }
}


async function singleProfile(){
    let params = new URLSearchParams(window.location.search);
    console.log("params", params);

    let id = params.get('id');
    console.log("id", id)

    let token_key = params.get('login');
    console.log("token_key", token_key);


    let token = localStorage.getItem(token_key)
    console.log("token", token);

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("response", response)

        let parsed_Response = await response.json()
        console.log("parsed_Response", parsed_Response);

        let data = parsed_Response.data
        console.log("data", data);

        let profileContainer = document.getElementById('profileContainer');

        let viewContainer = `
        <div>${data.name}</div>
        <div>${data.email}</div>
        <div>${data.phone}</div>
        <div>${data.age}</div>

        <div><button onclick = "updateClick('${data._id}')">update</button></div>

        `

        profileContainer.innerHTML = viewContainer
    }
    catch(error){
        console.log("error",error);
    }
}

function Profile(){

    let params = new URLSearchParams(window.location.search);

    let token_key = params.get('login');
    let id = params.get('id');
    console.log("id",id)

     window.location = `profile.html?login=${token_key}&id=${id}`;


}
async function profileView(){
    let profileContainer = document.getElementById('profileContainer')

    let params = new URLSearchParams(window.location.search);
    console.log("params", params);
    
    let id = params.get('id');
    console.log("id", id)
    
    let token_key = params.get('login');
    console.log("token_key", token_key);
    

    let token = localStorage.getItem(token_key)
    console.log("token", token);

    try {
        let response = await fetch(`/user/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("response", response)

        let parsed_Response = await response.json()
        console.log("parsed_Response", parsed_Response);

        let data = parsed_Response.data
        console.log("data", data);


       let profile = `
        <div>
             <div class="profile-details ">
              <div id="name"><strong>Name:</strong> ${data.name}</div>
              <p><strong>Email:</strong>${data.email}</p>
              <p><strong>Age:</strong>${data.age}</p>
              <p><strong>Phone Number:</strong>${data.phone}</p>
            </div> 
        </div>
       `
       profileContainer.innerHTML = profile
}
catch(error){
    console.log('error',error);
}
}

function signout() {
    console.log("Signout function reached");

    // Get the URL parameters
    let params = new URLSearchParams(window.location.search);
    
    // Retrieve the token key from the 'login' query parameter
    let token_key = params.get('login');
    
    
    // Check if the token key exists
    if (token_key) {
        console.log("Token Key:", token_key);
        
        // Remove the item from localStorage
        localStorage.removeItem(token_key);
        console.log("Token Key removed:", token_key);
        console.log("Local Storage keys:", Object.keys(localStorage));


        // Optional: Redirect to index.html after successful signout
        // window.location = 'index.html';
        
    } else {
        console.log("No token key found in URL.");
    }
}

