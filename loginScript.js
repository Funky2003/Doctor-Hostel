const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55eW96c2pudm5iZ2x1ZHBudmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc0MTI1MzUsImV4cCI6MjAwMjk4ODUzNX0.tnGcjAMt7dFMrv5Hib0zUb5EgEyayfn5YnSH13LiAUg";
const url = "https://nyyozsjnvnbgludpnvjy.supabase.co";
const database = supabase.createClient(url, key);

const myArray = new Uint32Array(1);
let uID = crypto.getRandomValues(myArray);
id = uID[0];

let login = document.querySelector("#login");
var id;
//  Event CRUD operation...
login.addEventListener("click", async (e) => {
    e.preventDefault();
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    let success = await database.from("admin")
    .select("*")
    .filter("email", "eq", email)
    .filter("password", "eq", password);    

    if (success.data.length > 0) {

        id = success.data[0]['uID'];
        alert(`Login successful`);
        console.log(id);

        location.replace('../rooms.html');
  
    } else {
        alert(`Login failed`);
        console.error(`Login failed ${success}`);
    }

    localStorage.setItem('id', id);
    console.log(localStorage.getItem('id'));

    let admin_ID = uID[0];
    async function adminID (){
        const res = await database.from("rooms").select("*").filter("admin", "eq", adminID);
        console.log(admin_ID);
    }
    adminID();
});
