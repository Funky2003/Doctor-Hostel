const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eW96c2pudm5iZ2x1ZHBudmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc0MTI1MzUsImV4cCI6MjAwMjk4ODUzNX0.tnGcjAMt7dFMrv5Hib0zUb5EgEyayfn5YnSH13LiAUg";
const url = "https://nyyozsjnvnbgludpnvjy.supabase.co";
const database = supabase.createClient(url, key);

let save = document.querySelector("#save-event");
//  Event CRUD operation...
save.addEventListener("click", async (e) => {
    e.preventDefault();
    var event_id;
    let event_image = document.querySelector("#event-image").files[0];
    let event_type = document.querySelector("#event-type").value;
    let event_name = document.querySelector("#event-name").value;
    let event_location = document.querySelector("#event-location").value;
    let event_date = document.querySelector("#event-date").value;
    let event_charges = document.querySelector("#event-charges").value;  



   // const contentType = 'image/jpeg'; // Replace with the desired MIME type
    const event_image_file = await database
    .storage
    .from('images')
    .upload(`event_images/${event_image.name}`, event_image, {
        cacheControl: '3600',
        upsert: false,
        contentType: event_image.type, // Set the MIME type using the 'contentType' option
    });

    const imageUrl = database.storage
        .from('images') // Specify the bucket name
        .getPublicUrl(`event_images/${event_image.name}`); // Replace 'file_name.jpg' with the actual file name

        console.log(imageUrl.data.publicUrl); // Output the image URL

    console.log(event_image_file);

    save.innerText = "Saving....";
    save.setAttribute("disabled", true);
    let res = await database.from("events").insert({
        event_id,
        event_image: imageUrl.data.publicUrl,
        event_type: event_type,
        event_name: event_name,
        event_location: event_location,
        event_date: event_date,
        event_charges: event_charges,

    }); console.log(res);
    if (res) {
        alert("Event Added Successfully")
        save.innerText = "Save"
        save.setAttribute("disabled", false);
        event_image = event_image;
        event_type = "";
        event_name = "";
        event_location = "";
        event_date = "";
        event_charges = "";
        getEvent();

        getTotalCount();


    } else {
        alert("Event Not Added Successfully")
        save.innerText = "Save"
        save.setAttribute("disabled", false);
    }
})

const getEvent = async () => {
    let tbody = document.getElementById("tbody");
    let loading = document.getElementById("loading");
    let tr = "";
    loading.innerText = "Loading...."
    const res = await database.from("events").select("*");
    if (res) {
        for (var i in res.data) {
            tr += `<tr>
         <td>${parseInt(i) + 1}</td>
         <td>${res.data[i].event_image}</td>
         <td>${res.data[i].event_type}</td>
         <td>${res.data[i].created_at}</td>
         <td>${res.data[i].event_name}</td>
         <td>${res.data[i].event_location}</td>
         <td>${res.data[i].event_date}</td>
         <td>${res.data[i].event_charges}</td>
         <td><button class="btn btn-primary" data-bs-toggle="modal"
         onclick='editEvents(${res.data[i].event_id})' data-bs-target="#editModel">Edit</button></td>
         <td><button onclick='deleteEvents(${res.data[i].event_id})' class="btn btn-danger">Delete</button></td>
         </tr>`;
        }
        tbody.innerHTML = tr;
        loading.innerText = ""

    }

}

getEvent();

const getTotalCount = async () => {
    let total = document.querySelector("#total");
    const res = await database.from("events").select("*", { count: "exact" });
    total.innerText = res.data.length;
}

getTotalCount();

const editEvents = async (event_id) => {
    const res = await database.from("events").select("*").eq("event_id", event_id);
    if (res) {
        document.getElementById("event_id").value = res.data[0].event_id;
        document.getElementById("edit-event-image").value = res.data[0].event_image;
        document.getElementById("edit-event-type").value = res.data[0].event_type;
        document.getElementById("edit-event-name").value = res.data[0].event_name;
        document.getElementById("edit-event-location").value = res.data[0].event_location;
        document.getElementById("edit-event-date").value = res.data[0].event_date;
        document.getElementById("edit-event-charges").value = res.data[0].event_charges;

    }
}

const update = document.getElementById("update");

update.addEventListener("click", async () => {
    let event_id = document.getElementById("event_id").value;
    let event_image = document.getElementById("edit-event-image").value
    let event_type = document.getElementById("edit-event-type").value;
    let event_name = document.getElementById("edit-event-name").value;
    let event_location = document.getElementById("edit-event-location").value;
    let event_date = document.getElementById("edit-event-date").value;
    let event_charges = document.getElementById("edit-event-charges").value;

    update.innerText = "Updating...."
    update.setAttribute("disabled", true);
    const res = await database.from("events").update({
        event_image,
        event_type,
        event_location,
        event_name,
        event_date,
        event_charges
    }).eq("event_id", event_id)

    if (res) {
        alert("Event Update Successfully")
        update.innerText = "Update"
        update.setAttribute("disabled", false);
        event_image;
        event_type = "";
        event_location = "";
        event_name = "";
        event_date,
        event_charges = "";
        getEvent();
        getTotalCount();

    } else {
        alert("Event Not Update Successfully")
        update.innerText = "Update"
        update.setAttribute("disabled", false);
    }
})


const deleteEvents = async (event_id) => {
    const res = await database.from("events").delete().eq("event_id", event_id)

    if (res) {
        alert("Delete successfully")
        getEvent();
        getTotalCount();

    } else {
        alert("Delete successfully")
    }
}