
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import RoomModel from "../model/roomModel.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Booking Routes:

// Get the booking page
router.get("/booking", (req, res) => {

    const day = atMidnight();
    /* await */ ensureSeedFor(day, "study", 10);

    res.sendFile(path.join(__dirname, "../../pages/bookingJSIncluded.html"));
});

// Post booking page (form) and asign user to a room
router.post("/booking", async (req, res) => {
    
    const username = "Username"; // CHANGE THIS TO THE ACTUAL USERNAME
    
    try {
        // Assign the fields from the post method
        const category = req.body.category ?? "study";
        const date = req.body.date;
        const room = req.body.room;
        const time = req.body.time;

        if (!date || !room || !time) 
            return res.send('Error: Missing fields');

        const parts = date.split('-'); // ["year", "month", "day"]

        // Convert the string to numbers
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);

        const day = atMidnight(new Date(y, m - 1, d));

        const bookedBy = username;

        // Update the room
        const result = await RoomModel.updateOne(
            { category, room, day, 'slots.time': time, 'slots.status': 'free' },
            { $set: { 'slots.$.status': 'pending', 'slots.$.bookedBy': bookedBy } }
        );

        // If equal to zero nothing is matched so slot is pending/booked or bad input
        if (result.matchedCount === 0)
            return res.send('Error: Slot no longer available');

        // Redirect back to the page; you can show a toast via querystring if you want
        res.redirect(`/mybooking/${username}`);

    } catch (e) {
        res.send('Error: Booking failed, ' + e);
    }
});

// Used to get the data for the booking page
router.get("/booking/data", async (req, res) => {
    try {
        const category = req.query.category || 'study';
        
        // Convert date to numbers
        const [y, m, d] = (req.query.date || '').split('-').map(Number);

        // Make sure the date is valid
        if (!y || !m || !d) 
            return res.json({ error: 'Invalid date' });

        const day = atMidnight(new Date(y, m - 1, d));
        
        // Make sure up to date
        await ensureSeedFor(day, category, 10);

        // Find the slot
        const rooms = await RoomModel.find({ category, day }).sort({ room: 1 }).lean();

        // Return the json to be displayed
        res.json({ rooms: rooms.map(r => ({ room: r.room, slots: r.slots.map(s => ({ time: s.time, status: s.status })) })) });
    } catch (e) {
        res.json({ error: 'Failed to load data' });
    }
});

// Get the page were users can see their bookings
router.get("/mybooking/:id", async (req, res) => {
    
    const username = req.params.id;

    let css = `
        body
        {
            font-family: 'Arial', sans-serif;
        }
        .top-h2
        {
            padding-left: 20px;
        }


        .hide
        {
            display: none;
        }


        main a
        {
            color: dodgerblue;
        }

        main
        {
            max-width: 1500px;
            margin: 0 auto;
            flex: 1;
        }
        section
        {
            padding: 5px 10px;
            height: 100%;
            min-height: 150px;
            width: 100% - 20px;
            margin: 20px;
            background-color: #F9FAFC;
            border: 1px solid #ccc;
            /* box-shadow: 1px 1px 5px #0000004D; */
            border-radius: 5px;
        }

        .sec
        {
            display: block;
            justify-content: space-between;
            align-items: center;

            /* display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px; */
        }
        .right
        {
            margin-left: auto;
            display: flex;
            gap: 10px;
            
        }

        .category
        {
            margin: 20px;
            color: black;
        }

        .modify-pill-btn {
            background-color: transparent;
            border: 2px solid orange;
            color: orange;
            padding: 5px 15px;
            text-align: center;
            border-radius: 50px; /* has to be atleast half its height*/
        }
        .modify-pill-btn:hover {
            background: orange;
            color: white;
        }

        .hide {
            display: none;
        }

        .cancel-pill-btn {
            background-color: transparent;
            border: 2px solid red;
            color: red;
            padding: 5px 15px;
            text-align: center;
            border-radius: 50px; /* has to be atleast half its height*/
        }
        .cancel-pill-btn:hover {
            background: red;
            color: white;
        }

        .bottom
        {
            padding-left: 20px
        }
        body.mybookings-page.darkmode {
            background-color: #121212;
            color: #eaeaea;
        }

        body.mybookings-page.darkmode main {
            background-color: #1f1f1f;
            color: #f0f0f0;
            border-color: #333;
        }

        body.mybookings-page.darkmode section {
            background-color: #242424;
            border: 1px solid #333;
            color: #ddd;
        }

        body.mybookings-page.darkmode .modify-pill-btn {
            border-color: #ffa726;
            color: #ffa726;
        }
        body.mybookings-page.darkmode .modify-pill-btn:hover {
            background: #ffa726;
            color: white;
        }

        body.mybookings-page.darkmode .cancel-pill-btn {
            border-color: #ef5350;
            color: #ef5350;
        }
        body.mybookings-page.darkmode .cancel-pill-btn:hover {
            background: #ef5350;
            color: white;
        }

        body.mybookings-page.darkmode a {
            color: #66b2ff;
        }
        body.mybookings-page.darkmode a:hover {
            color: #009dff;
        }
    `

    // Get all slots that contain the username
    const docs = await RoomModel.find({"slots.bookedBy": username}).select({category: 1, room: 1, day: 1, slots: 1}).lean();

    // Format to make it simpler to use, i dont want the whole object
    const booking = [];
    for (let i = 0; i < docs.length; i++) { // rooms
        const room = docs[i];

        for (let j = 0; j < room.slots.length; j++) { // slots
            const slot = room.slots[j];

            if (slot.bookedBy === username) {
                booking.push({
                    slotId: slot._id,
                    category: room.category,
                    room: room.room,
                    //date: room.day.toString().slice(0, 10),
                    date: room.day.toISOString().slice(0, 10),
                    dateComparison: room.day.getTime(), // date we just converted to a string so need a normal one for comparisons
                    time: slot.time,
                    status: slot.status,
                    bookedBy: slot.bookedBy
                })
            }
        }
    }

    // Seperate rooms into current/past
    let today = new Date();
    let currentRooms = ""; // leave empty so the length check works if no times
    let pastRooms = ""; // leave empty so the length check works if no times
    for (let i = 0; i < booking.length; i++) {

        if (today.getTime() < booking[i].dateComparison) {
            
            let colour = "white";
            if (booking[i].status === "pending")
                colour = "orange";
            else if (booking[i].status === "booked")
                colour = "limegreen";

            currentRooms += `
            <div class="booking-row" data-slot-id="${booking[i].slotId}">
                <p>
                    <b>${booking[i].category}</b>,
                    ${booking[i].room},
                    ${booking[i].date},
                    ${booking[i].time},
                    <b style="color: ${colour};">${booking[i].status}</b>
                </p>
                <button class="cancel-pill-btn">Cancel</button>
            </div>`
        } else {
            pastRooms += `
            <p>
                <b>${booking[i].category}</b>,
                ${booking[i].room},
                ${booking[i].date},
                ${booking[i].time}
            </p>`
        }
    }

    // If current or past rooms are empty, dispay following messages
    if (currentRooms.length === 0) {
        currentRooms = "<div id=\"no-bookings\"><p>You currently have no current bookings. <a href=\"/booking\">Create a booking</a></p></div>";
    }
    if (pastRooms.length === 0) {
        pastRooms = "<p id=\"no-past-bookings\">You have no past bookings.</p>";
    }

    let html = 
    `<!DOCTYPE html>
    <html lang="en>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="../css/style.css">

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

        <title>${username} Bookings</title>
    </head>
    <body>
        <style>
            ${css}
        </style>

        <header class="NavBarContainer">
            <div class="menu-toggle" id="menu-toggle"><i class="fa-solid fa-bars"></i></div>
            <div class="logo">ConcoHub</div>

            <div class="search-bar">
                <input type="text" placeholder="Search bookings/resources…" id="global-search" />
            </div>

            <nav class="NavButton">
                <button class="SignIn-btn" id="sign-in">Sign In</button>
                <button class="GetStarted-btn" id="sign-up">Get Started</button>
                <button class="SignOut-btn" id="sign-out-btn">Sign Out</button>

                <label class="switch">
                    <input type="checkbox" id="theme-toggle" />
                    <span class="slider">
                        <i class="fa-solid fa-moon"></i>
                        <i class="fa-solid fa-sun"></i>
                    </span>
                </label>
            </nav>
        </header>

        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <button class="close-btn" id="close-btn">×</button>
            <ul>
                <li><a href="../index.html"><i class="fa-solid fa-house"></i> Home</a></li>
                <li><a href="../pages/booking.html"><i class="fa-solid fa-calendar-check"></i> Browse Resources</a></li>
                <li><a href="adminDashboard.html" class="active"><i class="fa-solid fa-gears"></i> Admin Dashboard</a></li>
                <li><a href="settings.html"><i class="fa-solid fa-user-gear"></i> Settings</a></li>
            </ul>
        </aside>

        <main>
            <h2 class="top-h2">Student Bookings</h2>
            <section>
                <h3>Current</h3>
                <!--
                <div id="no-bookings">
                    <p>You currently have no current bookings. <a href="/booking">Create a booking</a></p>
                </div>
                -->

                <div id="current-bookings" class="">
                    ${currentRooms}
                </div>
            </section>

            <section>
                <div>
                    <h3>Past</h3>
                    <div id="past-bookings">
                    ${pastRooms}
                        <!--<p id="no-past-bookings">You have no past bookings.</p>-->
                    </div>
                </div>
            </section>

            <div class="bottom">
                <p><a href="/booking">Want to create another booking?</a></p>
            </div>

        </main>

        <footer class="footer">
            <div class="footer-links">
                <div>
                    <h4>For Students</h4>
                    <ul>
                        <li><a href="booking.html">Browse Resources</a></li>
                        <li><a href="mybookings.html">My Bookings</a></li>
                        <li><a href="settings.html">Account Settings</a></li>
                    </ul>
                </div>
                <div>
                    <h4>For Administrators</h4>
                    <ul>
                        <li><a href="adminDashboard.html" class="admin-link">Admin Dashboard</a></li>
                        <li><a href="adminDashboard.html" class="admin-link">Manage Resources</a></li>
                        <li><a href="adminDashboard.html" class="admin-link">Set Availability</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Support</h4>
                    <ul>
                        <li><a href="../pages/support.html">Help Center</a></li>
                        <li><a href="../pages/faq.html">FAQ</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                © 2025 Concordia University. All rights reserved. | SOEN 287 Web Programming Project
            </div>
        </footer>
    
        <script>
            // Add listeners to the row and buttons
            document.querySelectorAll(".booking-row").forEach(row => {
                const btn = row.querySelector(".cancel-pill-btn");

                btn.addEventListener("click", async () => {
                    console.log("button data:", row.dataset);
                    console.log("click");
                    const slotId = row.dataset.slotId;
                    if (!slotId) {
                        console.log("slotId error");
                    }    
                    
                    // Cancel booking using fetch method
                    try {
                        const res = await fetch("/booking/cancel", {
                            method: "post",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({slotId})
                        });
                        
                        row.innerHTML = "<b style=\'color: limegreen;\'>Booking canceled successfully!</b>";
                    } catch(error) {
                        console.log(error);
                    }
                });
            });
        </script>
    
    </body>
    </html>
    `

    res.send(html);
});

router.post("/booking/cancel", async (req, res) =>{
    try {
        const slotId = req.body.slotId;
        if (!slotId) {
            console.log("SlotId undef");
            return;
        }

        // find the room that matches the id
        const room = await RoomModel.findOne({"slots._id": slotId});
        if (!room) {
            console.log("room undef");
            return;
        }
        
        // find the slot
        const slot = room.slots.id(slotId);
        slot.status = "free"; 
        slot.bookedBy = null;

        await room.save();
        res.json({success: "true"});
    }
    catch (error) {
        console.log(error);
    }
});

// Here for testing
router.get("/reset", async (req, res) => {
    resetAllRooms();
})

// Helper functions: ===========

// Make dates start at midnight to avoid errors in mongo
function atMidnight(day = new Date()) {
    const date = new Date(day);
    date.setHours(0, 0, 0, 0);
    return date;
}

// The new days (room timeslots) in the database will be created here
// /Booking will call this function to create the day if it hasent been created yet.
async function ensureSeedFor(day, category = "study", roomCount = 10) {

    // Check if exists for the category and day
    const alreadyExists = await RoomModel.countDocuments({ category, day });
    if (alreadyExists > 0) 
        return;

    // Create the slots for the day
    const daySlotArray = generateSlots("8:00", "16:00", 60);

    // Study rooms: LB-001
    // SportsFacility: RA-001 (i think RA is loyola)
    // SpecializedEquipment: FB-001
    // SoftwareSeats: HA-001
    let prefix;
    if (category == "study") {
        prefix = "LB";
    }
    else if (category === "sportsFacility") {
        prefix = "RA";
    }
    else if (category === "specializedEquipment") {
        prefix = "FB";
    }
    else if (category === "softwareSeats") {
        prefix = "HA"
    }
    else {
        // in case i made a typo somewhere
        prefix = "S";
    }

    // Build the rooms
    const docs = [];
    for (let i = 1; i <= roomCount; i++) {
        
        const roomName = `${prefix}-${String(i).padStart(3, "0")}`; // HA-001
        
        docs.push( {
            category, 
            room: roomName, 
            day, 
            slots: daySlotArray.map(s => ({ ...s }))
        });
    }

    // Add them to db
    try {
        await RoomModel.insertMany(docs, {ordered: false});
    } catch (err) {
        // Log the errors into msg
        let msg = "";
        if (err && err.message) {
            msg = err.message;
        }
        // Duplicates:
        if (!msg.includes("E11000")) throw err;
    }
}

// Creates the slots 
function generateSlots(minTime = "08:00", maxTime = "16:00", spaceBetweenTimesInMinutes = 60) {

    // Split the Hour and Minute strings to split into array elements
    const minParts = minTime.split(":");
    const maxParts = maxTime.split(":");

    // Convert the strings to ints
    const minHour = parseInt(minParts[0], 10);
    const minMinute = parseInt(minParts[1], 10);
    const maxHour = parseInt(maxParts[0], 10);
    const maxMinute = parseInt(maxParts[1], 10);

    // Convert the times to minutes
    const minTotalMinutes = minHour * 60 + minMinute;
    const maxTotalMinutes = maxHour * 60 + maxMinute;

    const slots = []; // store slots

    for (let currentMinutes = minTotalMinutes; currentMinutes <= maxTotalMinutes; currentMinutes += spaceBetweenTimesInMinutes) {
        // Convert total minutes back to hour + minute
        const hour = Math.floor(currentMinutes / 60); // 480 to 8
        const minute = currentMinutes % 60;           // 485 to 5

        // Turn hour and minute into zero-padded strings "HH" and "MM"
        const hourString = String(hour).padStart(2, "0"); // 8 to "08"
        const minuteString = String(minute).padStart(2, "0"); // 5 to "05"

        // Build the final "HH:MM" string
        const timeString = `${hourString}:${minuteString}`;

        // Push the slot object (same structure as before)
        slots.push({ time: timeString, status: "free" });
    }

    return slots;
}

// Reset all rooms
async function resetAllRooms() {
    return RoomModel.updateMany({}, { $set: { "slots.$[].status": "free", "slots.$[].bookedBy": null } });
}

export default router;