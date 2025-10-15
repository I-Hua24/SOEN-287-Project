const maxBookingInFuture = 14; // how many days in advance

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


// Display the calendar
renderCalendar();

// Functions:
function renderCalendar() 
{
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calEl = document.getElementById("calendar");
    const outputDateTop = document.getElementById("selected-date-top");
    const outputDate = document.getElementById("selected-date");

    // Work out current month to show
    const base = new Date(minDate.getFullYear(), minDate.getMonth() + offsetMonths, 1);
    const year = base.getFullYear();
    const month = base.getMonth();

    calEl.innerHTML = "";

    // Header
    calEl.innerHTML += `<div class="month">
                        <div class="title">${base.toLocaleString(undefined, {month:"long"})}</div>
                        <div class="subtitle">${year}</div></div>`;

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
            outputDateTop.style.color = "dodgerblue";
            outputDateTop.style.fontWeight = "bold";
            
            outputDate.textContent = selectedDate.toString().slice(0, 10);
            outputDate.style.color = "dodgerblue";
            outputDate.style.fontWeight = "bold";

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

function renderTimes()
{
    // Room Values
    const rooms = [
        ["8:00", "9:00", "10:00", "11:00"],
        ["8:00", "9:00", "10:00", "11:00"],
        ["8:00", "9:00", "10:00", "11:00"]
    ];

    const roomAvailability = [
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]

    // Check to see if there are any rooms left available
    let available = false;
    for (let i = 0; i < roomAvailability.length; i++)
    {
        for (let j = 0; j < roomAvailability[i].length; j++)
        {
            if (roomAvailability[i][j] === 0)
            {
                available = true;
                break;
            }
        }
    }
    if (!available)
    {
        console.log("No rooms available.");
    }

    const list = document.getElementById("time-list");
    const outputRoom = document.getElementById("selected-room");
    const outputTime = document.getElementById("selected-time");

    // Remove previous room content
    // Otherwise it will just add the new clicked date rooms below old.
    list.replaceChildren();

    // Loop through and create <div> for each pill
    for (let i = 0; i < rooms.length; i++)
    {
        // Display room name
        const roomName = document.createElement("p");
        roomName.textContent = `Room ${i+1}`;
        roomName.classList.add("time-list");
        list.appendChild(roomName);

        for (let j = 0; j < rooms[i].length; j++)
        {
            // Dont show time button if taken
            if (roomAvailability[i][j] === 1)
            {
                continue;
            }

            // Buttons (times for the room)
            const button = document.createElement("button");
            button.classList.add("pill-btn"); // add styling
            button.textContent = rooms[i][j];
            list.appendChild(button); // add to the page

            // Listen and track button click
            button.addEventListener("click", () => {
                selectedRoom = "Room " + (i + 1);
                selectedTime = rooms[i][j];
                console.log("Currently selected:", selectedTime);

                // Output selected time onto page
                outputRoom.textContent = selectedRoom + " at ";
                outputRoom.style.color = "dodgerblue";
                outputRoom.style.fontWeight = "bold";

                outputTime.textContent = selectedTime;
                outputTime.style.color = "dodgerblue";
                outputTime.style.fontWeight = "bold";

                // reset all other buttons to not active
                const buttons = document.querySelectorAll(".pill-btn");
                for (let k = 0; k < buttons.length; k++) 
                {
                    buttons[k].classList.remove("pill-btn-active");
                }

                // Make button active (green) when clicked
                button.classList.add("pill-btn-active");
            });
        }
        list.appendChild(document.createElement("br")); // make new line after each
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

    if (messages.length > 0)
    {
        e.preventDefault() // Prevents form from submitting
        errorElement.innerText = messages.join("\n"); // add the html to "error" div
        errorElement.classList.add("error"); // add styling
    }
})