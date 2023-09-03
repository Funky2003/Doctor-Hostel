const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eW96c2pudm5iZ2x1ZHBudmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc0MTI1MzUsImV4cCI6MjAwMjk4ODUzNX0.tnGcjAMt7dFMrv5Hib0zUb5EgEyayfn5YnSH13LiAUg";

const url = "https://nyyozsjnvnbgludpnvjy.supabase.co";

const database = supabase.createClient(url, key);

// Room CRUD operation...

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
  
  [url1, url2, url3] = urlArray;
  console.log('Url1:' + url1);
  console.log('Url2:' + url2);
  console.log('Url3:' + url3);
  
});

const getRoom = async () => {
    let tbody = document.getElementById("tbody");
    let loading = document.getElementById("loading");
    let tr = "";
    loading.innerText = "Loading...."
    const res = await database.from("rooms").select("*");
    if (res) {
        for (var i in res.data) {
            tr += `<tr>
         <td>${parseInt(i) + 1}</td>

         <td>${res.data[i].room_amenities_image_1}</td>

         <td><button class="btn btn-primary" data-bs-toggle="modal"
         onclick='editUser(${res.data[i].room_id})' data-bs-target="#editModel">Edit</button></td>
         <td><button onclick='deleteUser(${res.data[i].room_id})' class="btn btn-danger">Delete</button></td>
         </tr>`;
        }
        tbody.innerHTML = tr;
        loading.innerText = ""

    }

}

getRoom();

const getTotalCount = async () => {
    let total = document.querySelector("#total");
    const res = await database.from("rooms").select("*", { count: "exact" });
    total.innerText = res.data.length;
}

getTotalCount();