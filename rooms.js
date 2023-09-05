const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eW96c2pudm5iZ2x1ZHBudmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc0MTI1MzUsImV4cCI6MjAwMjk4ODUzNX0.tnGcjAMt7dFMrv5Hib0zUb5EgEyayfn5YnSH13LiAUg";

const url = "https://nyyozsjnvnbgludpnvjy.supabase.co";

const database = supabase.createClient(url, key);

    let admin_ID = localStorage.getItem("id");
    let admin_n = localStorage.getItem("admin");
    console.log(admin_ID);
    console.log(admin_n);
    let admin_ = document.getElementById("adminName").innerHTML = admin_n;

    // A simple query to get the total number of rooms in the room table....
        const getTotalCount = async () => {
            let totalRooms = document.getElementById("totalRooms");
            const res = await database.from("rooms").select("*", { count: "exact" }).filter("admin", "eq", admin_ID);
            totalRooms.innerText = res.data.length;
        }
        getTotalCount();
    // Total rooms CRUD operation...

    // Let's retrieve the total number of available rooms in the database
    const getAvailableRooms = async () => {
        let availableRooms = document.getElementById("availableRooms");
        const res = await database
        .from("rooms")
        .select("*")
        .filter("admin", "eq", admin_ID)
        .filter("room_status", "eq", true);
        availableRooms.innerText = res.data.length;
    }
    getAvailableRooms();
    // Available rooms CRUD operation...

    // Let's retrieve the total number of booked rooms in the database
    const getTotalBookedRooms = async () => {
        let bookedRooms = document.getElementById("bookedRooms");
        const res = await database
        .from("rooms")
        .select("*")
        .filter("admin", "eq", admin_ID)
        .filter("room_status", "eq", false);
        bookedRooms.innerText = res.data.length;
    }
    getTotalBookedRooms();
    // Booked rooms CRUD operation...
    // Let's retrieve the total income made on booked rooms
    let totalBookedRoomsPrice = 0;
    const getTotalIncome = async () => {
        let totalIncome = document.getElementById("totalIncome");
        const res = await database
        .from("rooms")
        .select("room_price")
        .filter("admin", "eq", admin_ID)
        .filter("room_status", "eq", false);
        for (const key in res.data) {
            if (res.data.hasOwnProperty.call(res.data, key)) {
                const element = res.data[key];
                totalBookedRoomsPrice += element['room_price'];
                console.log(element);
                totalIncome.innerText = `Ghc ${totalBookedRoomsPrice}`;
            }
        }
    }
    getTotalIncome();
    // Booked rooms total income CRUD operation...

    let admin_name = document.getElementById("#admin_name");
    let save_room = document.querySelector("#save-room");
    save_room.addEventListener("click", async (e) =>{
        e.preventDefault();
        let room_id;
        let room_name = document.querySelector('#room-name').value;
        let room_type = document.querySelector('#room-type').value;
        let room_address = document.querySelector('#room-address').value;
        let room_price = document.querySelector('#room-price').value;

        let room_amenities_text_1 = document.querySelector('#room-amenities-text-1').value;
        let room_amenities_text_2 = document.querySelector('#room-amenities-text-2').value;
        let room_amenities_text_3 = document.querySelector('#room-amenities-text-3').value;
        /*---------------------------------Let's create an array for the room photos---------------------------*/
        // const room_amenities_text_array = [ room_amenities_text_1, room_amenities_text_2, room_amenities_text_3 ];


        let room_photos_1 = document.querySelector('#room-photos-0').files[0];
        let room_photos_2 = document.querySelector('#room-photos-1').files[0];
        let room_photos_3 = document.querySelector('#room-photos-2').files[0];
        /*---------------------------------Let's create an array for the room photos---------------------------*/
        const room_photos_array = [ room_photos_1, room_photos_2, room_photos_3 ];

        // let room_status = document.querySelector('#room-status').value;
        let room_rating = document.querySelector('#room-rating').value;
        let room_description = document.querySelector('#room-description').value;

        let room_amenities_image_1 = document.querySelector('#room-amenities-image-1').files[0];
        let room_amenities_image_2 = document.querySelector('#room-amenities-image-2').files[0];
        let room_amenities_image_3 = document.querySelector('#room-amenities-image-3').files[0];
        /*---------------------------------Let's create an array for the room amenity images--------------------*/
        const image_array = [ room_amenities_image_1, room_amenities_image_2, room_amenities_image_3 ];

        let room_phone_call = document.querySelector('#room-phone-call').value;
        let room_lat = document.querySelector('#room-lat').value;
        let room_long = document.querySelector('#room-long').value;
    //*****************************************************************************************/



    /*----------------Let's create a funtion to upload the room photos to the SUPABASE DATABASE--------------*/
        async function uploadRoomFiles(files) {
            for (const file of files) {
            const { data, error } = await database
                .storage
                .from('images')
                .upload(`room_photos/${file.name}`, file, {
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
        uploadRoomFiles(room_photos_array);
        console.log(room_photos_array);

        var room_photo_url_1, room_photo_url_2, room_photo_url_3;
        async function getPhotoUrl(fileUrl){
            let room_photo_url_urlArray = [];
            
            for (const file of fileUrl) {
                const imageUrl = database.storage
                .from('images') // Specify the bucket name
                .getPublicUrl(`room_photos/${file.name}`); 
                room_photo_url_urlArray.push(imageUrl.data.publicUrl); // Output the image URL
            }
            [room_photo_url_1, room_photo_url_2, room_photo_url_3] = room_photo_url_urlArray;
        }
        getPhotoUrl(room_photos_array); 
        // let room_photo_url_url = [room_photo_url_1, room_photo_url_2, room_photo_url_3];
        console.log([room_photo_url_1, room_photo_url_2, room_photo_url_3]);

    //*****************************************************************************************/
    //*****************************************************************************************/

    /*----------------Let's create a funtion to upload the room_amenity images to the SUPABASE DATABASE--------------*/
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
        async function getUrl(fileUrl){
            let urlArray = [];
            for (const file of fileUrl) {
                const imageUrl = database.storage
                .from('images') // Specify the bucket name
                .getPublicUrl(`room_amenity_images/${file.name}`); // Replace 'file_name.jpg' with the actual file name
                urlArray.push(imageUrl.data.publicUrl); // Output the image URL
            }
            [url1, url2, url3] = urlArray;
        }
        getUrl(image_array); 
        // let room_amenities_image_url = [url1, url2, url3];
        console.log([url1, url2, url3]);
        
    //*****************************************************************************************/
    //*****************************************************************************************/


    //*****************************************************************************************/
    /*                     Let's save the roo details into the supabase database server       */
    //*****************************************************************************************/
        save_room.innerText = 'Saving...';
        save_room.setAttribute('disabeled', true);
        let res = await database.from('rooms').insert({
            room_id,
            created_at: new Date().toLocaleDateString(),
            room_name: room_name,
            room_type: room_type,
            room_address: room_address,
            room_price: room_price,
            room_amenities_text: [ room_amenities_text_1, room_amenities_text_2, room_amenities_text_3 ], //This array contains the three amenities of the room
            room_photos: [room_photo_url_1, room_photo_url_2, room_photo_url_3], //Newly created to receive the image links from the server...
            room_status: true,
            room_rating: room_rating,
            room_description: room_description,
            room_amenities_image: [url1, url2, url3], //This is used to get the image url from the server redponse...
            room_phone_call: room_phone_call,
            room_lat: room_lat,
            room_long: room_long,
            admin: admin_ID,
        })
    //*****************************************************************************************/
    //*****************************************************************************************/
    

    //*****************************************************************************************/
    /*                           Let's retrieve and display the uploaded data                 */
    //*****************************************************************************************/
        if(res){
            alert('Room add success...!')
            save_room.setAttribute('disabeled', false);
            save_room.innerText = 'Save';
            room_name = '';
            room_type = '';
            room_price = '';

            getRoom();
            getTotalCount();

        } else{
            alert('Room add no success...!')
            save_room.setAttribute('disabeled', false);
            save_room.innerText('Save');
        }
    });

    const getRoom = async () => {
        let tbody = document.getElementById("tbody");
        let tableRow = "";
        loading.innerText = "Loading...."
        const res = await database.from("rooms").select("*").filter("admin", "eq", admin_ID);
        if (res) {
            for (var i in res.data) {
                tableRow += `<tr>
                    <td>${parent(i)}</td>
                    <td>${res.data[i].created_at}</td>
                    <td>${res.data[i].room_name}</td>
                    <td>${res.data[i].room_type}</td>
                    <td>${res.data[i].room_price}</td>
                </tr>`;
            }
            tbody.innerHTML = tableRow;
            loading.innerText = ""

        }
        console.log(res.data[0]['room_photos']);
        console.log(res.data[0]['room_amenities_image']);


    }
    getRoom();



