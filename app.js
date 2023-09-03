const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eW96c2pudm5iZ2x1ZHBudmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc0MTI1MzUsImV4cCI6MjAwMjk4ODUzNX0.tnGcjAMt7dFMrv5Hib0zUb5EgEyayfn5YnSH13LiAUg";

const url = "https://nyyozsjnvnbgludpnvjy.supabase.co";

const database = supabase.createClient(url, key);

let save = document.querySelector("#save");

//  User CRUD operation...
save.addEventListener("click", async (e) => {
    e.preventDefault();
    let user_id;
    let user_name = document.querySelector("#username").value;
    let user_email = document.querySelector("#email").value;
    let user_password = document.querySelector("#password").value;
    let user_phone_no = document.querySelector("#mobile").value;
    let user_profile_url = "";

    save.innerText = "Saving....";
    save.setAttribute("disabled", true);
    let res = await database.from("users").insert({
        user_id,
        created_at: new Date().toLocaleDateString(),
        user_name: user_name,
        user_email: user_email,
        user_password: user_password,
        user_phone_no: user_phone_no,
        user_profile_url,
    })
    if (res) {
        alert("User Add Successfully")
        save.innerText = "Save"
        save.setAttribute("disabled", false);
        user_name = "";
        user_email = "";
        user_password = "";
        user_phone_no = "";
        getUser();

        getTotalCount();


    } else {
        alert("User Not Add Successfully")
        save.innerText = "Save"
        save.setAttribute("disabled", false);
    }
})

const getUser = async () => {
    let tbody = document.getElementById("tbody");
    let loading = document.getElementById("loading");
    let tr = "";
    loading.innerText = "Loading...."
    const res = await database.from("users").select("*");
    if (res) {
        for (var i in res.data) {
            tr += `<tr>
         <td>${parseInt(i) + 1}</td>
         <td>${res.data[i].user_name}</td>
         <td>${res.data[i].user_email}</td>
         <td>${res.data[i].created_at}</td>
         <td>${res.data[i].user_password}</td>
         <td>${res.data[i].user_phone_no}</td>
         <td><button class="btn btn-primary" data-bs-toggle="modal"
         onclick='editUser(${res.data[i].user_id})' data-bs-target="#editModel">Edit</button></td>
         <td><button onclick='deleteUser(${res.data[i].user_id})' class="btn btn-danger">Delete</button></td>
         </tr>`;
        }
        tbody.innerHTML = tr;
        loading.innerText = ""

    }

}

getUser();

const getTotalCount = async () => {
    let total = document.querySelector("#total");
    const res = await database.from("users").select("*", { count: "exact" });
    total.innerText = res.data.length;
}

getTotalCount();

const editUser = async (user_id) => {
    const res = await database.from("users").select("*").eq("user_id", user_id);
    if (res) {
        document.getElementById("user_id").value = res.data[0].user_id;
        document.getElementById("edit-user-name").value = res.data[0].user_name;
        document.getElementById("edit-user-email").value = res.data[0].user_email;
        document.getElementById("edit-user-password").value = res.data[0].user_password;
        document.getElementById("edit-user-phone-no").value = res.data[0].user_phone_no;
    }
}

const update = document.getElementById("update");

update.addEventListener("click", async () => {
    let user_id = document.getElementById("user_id").value;
    let user_name = document.getElementById("edit-user-name").value
    let user_email = document.getElementById("edit-user-email").value;
    let user_password = document.getElementById("edit-user-password").value;
    let user_phone_no = document.getElementById("edit-user-phone-no").value;
    update.innerText = "Updating...."
    update.setAttribute("disabled", true);
    const res = await database.from("users").update({
        user_name,
        user_email,
        user_phone_no,
        user_password
    }).eq("user_id", user_id)

    if (res) {
        alert("User Update Successfully")
        update.innerText = "Update"
        update.setAttribute("disabled", false);
        user_name = "";
        user_email = "";
        user_phone_no = "";
        user_password = "";
        getUser();
        getTotalCount();

    } else {
        alert("User Not Update Successfully")
        update.innerText = "Update"
        update.setAttribute("disabled", false);
    }
})


const deleteUser = async (user_id) => {
    const res = await database.from("users").delete().eq("user_id", user_id)

    if (res) {
        alert("Delete successfully")
        getUser();
        getTotalCount();

    } else {
        alert("Delete successfully")
    }
}








let save_room = document.querySelector("#save-room");

save_room.addEventListener("click", async (e) =>{
  e.preventDefault();

    let room_amenities_image_1 = document.querySelector('#room-amenities-image-1').files[0];
    let room_amenities_image_2 = document.querySelector('#room-amenities-image-2').files[0];
    let room_amenities_image_3 = document.querySelector('#room-amenities-image-3').files[0];

  const image_array = [ room_amenities_image_1, room_amenities_image_2, room_amenities_image_3 ];
  async function uploadFiles(files) {
    for (const file of files) {
      const { data, error } = await database
        .storage
        .from('images')
        .upload(`room_amenity_images/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });
      
      if (error) {
        console.error('Error uploading file:', error);
      } else {
        console.log('File uploaded successfully:', data);
      }
    }
  }
  uploadFiles(image_array);
  console.log(image_array);

  var url1, url2, url3;
  const urlArray = [];
  async function getUrl(fileUrl){

      for (const file of fileUrl) {
          const imageUrl = database.storage
          .from('images') // Specify the bucket name
          .getPublicUrl(`room_amenity_images/${file.name}`); // Replace 'file_name.jpg' with the actual file name
          urlArray.push(imageUrl.data.publicUrl); // Output the image URL
      }
  }
  getUrl(image_array);
  [url1, url2, url3] = urlArray;
  console.log('Url1:' + url1);
  console.log('Url2:' + url2);
  console.log('Url3:' + url3);
  
});