

let selectedCategory = 0;
let selectedDate = null;
let selectedRoom = null;
let selectedTime = null;

const today = new Date(); // Create date obj (inits time as now)
today.setHours(0,0,0,0);

// Create the min allowed book date (Now)
// and max allowed book date (Depending on const maxBookingInFuture)
const minDate = new Date(today);
const maxDate = new Date(today);
maxDate.setDate(maxDate.getDate() + maxBookingInFuture);

let offsetMonths = 0;

// Calendar buttons
// For toolbar buttons styling
const prevBtn = document.getElementById("prevBtn");
const todayBtn = document.getElementById("todayBtn");
const nextBtn = document.getElementById("nextBtn");
prevBtn.addEventListener("click", () => {
    if (offsetMonths > 0) // Dont let user move the month backwards if not in future
    {
        offsetMonths--; renderCalendar(); 
    }
});
nextBtn.addEventListener("click", () => { 
    // Dont let user move to a month past the maxBookingInFuture
    if (offsetMonths === 0 && (today.getDay() + maxBookingInFuture) > daysInMonth(today.getFullYear(), today.getMonth()))
    {
        offsetMonths++; renderCalendar(); 
    }
});
todayBtn.addEventListener("click", () => {
    // Jump to todays month
    offsetMonths = 0; renderCalendar(); 
});

// Get the category value
const categorySelect = document.getElementById("category");
categorySelect.addEventListener("change", () => {

    if (categorySelect.value === "study")
    {
        selectedCategory = 0;
        renderCalendar();
        renderTimes();
    }
    else if (categorySelect.value === "sportsFacilities")
    {
        selectedCategory = 1;
        renderCalendar();
        renderTimes();
    }
    else if (categorySelect.value === "specializedEquipment")
    {
        selectedCategory = 2;
        renderCalendar();
        renderTimes();
    }
    else
    {
        selectedCategory = 3;
        renderCalendar();
        renderTimes();
    }

  console.log("Selected category changed to:", selectedCategory);
});

// Display the calendar
renderCalendar();

// Functions:
function renderCalendar() 
{
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calEl = document.getElementById("calendar");
    const outputDateTop = document.getElementById("selected-date-top"); // Display the date above selections
    const outputDate = document.getElementById("selected-date"); // Display the date in the confirmation div

    // Work out current month to show
    const base = new Date(minDate.getFullYear(), minDate.getMonth() + offsetMonths, 1);
    const year = base.getFullYear();
    const month = base.getMonth();

    calEl.innerHTML = "";

    // Header
    calEl.innerHTML += `<div class="month">
        <div class="title">${base.toLocaleString(undefined, {month:"long"})}</div>
        <div class="subtitle">${year}</div>
    </div>`;

    // Weekdays
    calEl.innerHTML += `<div class="weekdays">${weekdays.map(d => `<div>${d}</div>`).join("")}</div>`;

    // Days
    const days = document.createElement("ul");
    days.className = "days";

    // Empty pads before the 1st
    const firstDow = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDow; i++) 
    {
        days.innerHTML += `<li class="pad"></li>`;
    }

    // Actual days
    const total = daysInMonth(year, month);
    for (let d = 1; d <= total; d++) 
    {
        const date = new Date(year, month, d);
        const inRange = date >= minDate && date <= maxDate;
        const active = selectedDate && date.getTime() === selectedDate.getTime();

        days.innerHTML += `<li>
            <span class="day ${inRange ? "in-range" : ""} ${active ? "active" : ""}" data-y="${year}" data-m="${month}" data-d="${d}">
                ${d}
            </span>
        </li>`;
    }

    calEl.appendChild(days);

    // Add click listeners (only once)
    const spans = calEl.querySelectorAll(".day.in-range");

    // Add a listener to all calendar date buttons
    for (let i = 0; i < spans.length; i++) 
    {
        let span = spans[i];
        span.addEventListener("click", () => {
            selectedDate = new Date(span.dataset.y, span.dataset.m, span.dataset.d);
            console.log("Selected date: " + selectedDate.toString());
            outputDateTop.textContent = selectedDate.toString().slice(0, 10); // use slice to keep only the first 10 chars to remove gmt stuff
            
            outputDate.textContent = selectedDate.toString().slice(0, 10);
            outputDate.style.color = "dodgerblue"; outputDate.style.fontWeight = "bold"; // last min css

            renderCalendar(); // Re render so the highlights update
            renderTimes(); // Render the room times below calender
        });
    }
}

// Get the number of days in a specific month
function daysInMonth(year, month) 
{
    return new Date(year, month + 1, 0).getDate();
}

function sameYmd(d, y, m, day)
{ 
  return d.getFullYear() === y && (d.getMonth() + 1) === m && d.getDate() === day; 
}

function renderTimes()
{
    const list = document.getElementById("time-list");
    const outputRoom = document.getElementById("selected-room");
    const outputTime = document.getElementById("selected-time");

    list.replaceChildren();

    // Find the index of the selected date in days[]
    let indexDatePos = -1;
    for (let i = 0; i < days.length; i++) 
    {
        if (sameYmd(selectedDate, days[i].year, days[i].month, days[i].day)) 
        {
            indexDatePos = i;
            break;
        }
    }
    if (indexDatePos === -1) 
    {
        console.log("No matching day in `days` for", selectedDate);
        return;
    }

    const cat = days[indexDatePos].category[selectedCategory];
    if (!Array.isArray(cat)) // make sure its an array
    {
        console.log("Invalid category index:", selectedCategory);
        return;
    }

    // Outer loop: per room header
    for (let i = 0; i < maxRoomNum; i++)
    {
        // header for room i+1
        const roomName = document.createElement("p");
        roomName.textContent = "Room " + (i + 1);
        roomName.classList.add("time-list");
        list.appendChild(roomName);

        // Inner loop: times, but only those for this room number
        let allRoomsTaken = true;
        for (let j = 0; j < cat.length; j++)
        {
            const slot = cat[j];

            // Only show times belonging to this room header
            if (slot.roomNum !== i) continue;

            // Only show rooms that are between minRoomTime and maxRoomTime
            if (slot.time < minRoomTime || slot.time > maxRoomTime) continue;

            // skip if taken (roomOpen === false)
            if (!slot.roomOpen) continue;
            else allRoomsTaken = false;

            // Create time button
            const button = document.createElement("button");
            button.classList.add("pill-btn");
            button.textContent = slot.time + ":00";
            list.appendChild(button);

            button.addEventListener("click", () => {
                selectedRoom = "Room " + (i + 1);
                selectedTime = slot.time + ":00";;
                console.log("Currently selected:", selectedRoom, selectedTime);
                console.log("seleced room: " +selectedRoom);
                
                // Output selection
                outputRoom.textContent = selectedRoom + " at ";
                outputRoom.style.color = "dodgerblue";
                outputRoom.style.fontWeight = "bold";

                outputTime.textContent = selectedTime;
                outputTime.style.color = "dodgerblue";
                outputTime.style.fontWeight = "bold";

                // Toggle active state
                document.querySelectorAll(".pill-btn").forEach(b => b.classList.remove("pill-btn-active"));
                button.classList.add("pill-btn-active");
            });
        }

        if (allRoomsTaken)
        {
            roomName.textContent += " No times available for this room.";
        }

        list.appendChild(document.createElement("br"));
    }
}

// Error form handler
const purpose = document.getElementById("purpose");
const errorElement = document.getElementById("error"); // where we are gonna display the errors (in the error div)

form.addEventListener("submit", (e) => {
    let messages = []; // Store the error messages

    if (!selectedDate) 
    {
        messages.push("No date selected!");
    }
    if (!selectedRoom || !selectedTime) 
    {
        messages.push("No room and time selected!");
    }
    if (purpose.value === "none-selected")
    {
        messages.push("A purpose for the booking is required!");
    }

    //e.preventDefault() // Prevents form from submitting

    // Book selected rooms/time
    if (bookRoom(selectedCategory, selectedDate, selectedRoom, selectedTime, username))
    {
        let bookings = getBookings(username);
        console.log("Booked: ");
        logARoom(selectedCategory, selectedDate, selectedRoom, selectedTime);
        console.log(bookings);
        // cancelABooking(selectedCategory, selectedDate, selectedRoom, selectedTime);

        saveDays(); // saves updated state
    }    

    if (messages.length > 0)
    {
        e.preventDefault() // Prevents form from submitting
        errorElement.innerText = messages.join("\n"); // add the html to "error" div
        errorElement.classList.add("error"); // add styling
    }

    //renderTimes(); // here for debugging
})