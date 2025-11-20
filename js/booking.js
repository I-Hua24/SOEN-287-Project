const maxBookingInFuture = 30;
let selectedCategory = "study";
let selectedDate = null;
let selectedRoom = null;
let selectedTime = null;

const today = new Date(); today.setHours(0, 0, 0, 0);
const minDate = new Date(today);
const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + maxBookingInFuture);
let offsetMonths = 0;

// toolbar
const prevBtn = document.getElementById("prevBtn");
const todayBtn = document.getElementById("todayBtn");
const nextBtn = document.getElementById("nextBtn");
function updateButtons(){
    // prev button
    if (offsetMonths > 0) prevBtn.disabled = false; // Dont let user move the month backwards if not in future
    else prevBtn.disabled = true;

    // next button
    if (offsetMonths === 0 && (today.getDate() + maxBookingInFuture) > daysInMonth(today.getFullYear(), today.getMonth()))
        nextBtn.disabled = false;
    else nextBtn.disabled = true;

    // today button
    if (offsetMonths === 0) todayBtn.disabled = true;
    else todayBtn.disabled = false;
}

prevBtn.addEventListener("click", () => {
    if (offsetMonths > 0) { // Dont let user move the month backwards if not in future
        offsetMonths--; 
        renderCalendar(); 
        updateButtons(); 
    }
});
nextBtn.addEventListener("click", () => { 
    // Dont let user move to a month past the maxBookingInFuture
    if (offsetMonths === 0 && (today.getDate() + maxBookingInFuture) > daysInMonth(today.getFullYear(), today.getMonth())) {
        offsetMonths++;
        renderCalendar();
        updateButtons();
    }
});
todayBtn.addEventListener("click", () => { 
    // Jump to todays month
    offsetMonths = 0;
    renderCalendar();
    updateButtons();
});
updateButtons();

// Get the category value (string)
const categorySelect = document.getElementById("category");
categorySelect.addEventListener("change", () => {
    const v = categorySelect.value;
    selectedCategory = (v === "sportsFacilities") ? "sportsFacility" : v;
    renderCalendar();
    renderTimes();
    console.log("Selected category changed to:", selectedCategory);
});

// Display the calendar
renderCalendar();
function renderCalendar() {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const calEl = document.getElementById("calendar");
    const outputDateTop = document.getElementById("selected-date-top");
    const outputDate = document.getElementById("selected-date");

    // Work out current month to show
    const base = new Date(minDate.getFullYear(), minDate.getMonth() + offsetMonths, 1);
    const year = base.getFullYear();
    const month = base.getMonth();

    // Header
    calEl.innerHTML = "";
    calEl.innerHTML += '<div class="month"><div class="title">' + base.toLocaleString(undefined, {month: 'long' }) + '</div><div class="subtitle">' + year + '</div></div>';
    // Weekdays
    calEl.innerHTML += '<div class="weekdays">'+ weekdays.map(d => '<div>' + d + '</div>').join("") + '</div>';

    // Days
    const days = document.createElement("ul");
    days.className = "days";

    // Empty pads before the 1st
    const firstDow = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDow; i++) {
        days.innerHTML += '<li class="pad"></li>';
    }
        
    // Actual days
    const total = daysInMonth(year, month);
    for (let d = 1; d <= total; d++) {
        const date = new Date(year, month, d);
        const inRange = date >= minDate && date <= maxDate;
        const active = selectedDate && date.getTime() === selectedDate.getTime();
        days.innerHTML += 
        '<li><span class="day '+ (inRange ? 'in-range' : '') 
            + ' ' + (active ? 'active' : '') 
            + '" data-y="' + year 
            + '" data-m="'+ month 
            + '" data-d="' + d + '">' + d + '</span></li>';
    }
    calEl.appendChild(days);

    // Add click listeners (only once)
    calEl.querySelectorAll(".day.in-range").forEach(span => {
        span.addEventListener("click", async () => {
            selectedDate = new Date(span.dataset.y, span.dataset.m, span.dataset.d);

            outputDateTop.textContent = selectedDate.toString().slice(0,10);
            outputDate.textContent = selectedDate.toString().slice(0,10);
            outputDate.style.color = "dodgerblue"; outputDate.style.fontWeight = "bold";

            document.getElementById("hid-date").value = toYMD(selectedDate);

            logSelection();
            renderCalendar();

            await renderTimes();
        });
    });
}

// Get the number of days in a specific month
function daysInMonth(y, m) {
    return new Date(y, m+1, 0).getDate(); 
}

function toYMD(d) { 
    const y = d.getFullYear();
    const m = String(d.getMonth() +1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    return y + '-' + m + '-' + dd; 
}

// render times for current selected date/category
async function renderTimes() {
    const list = document.getElementById("time-list");
    const outputRoom = document.getElementById("selected-room");
    const outputTime = document.getElementById("selected-time");
    list.replaceChildren();

    if (!selectedDate) return;

    const dateStr = toYMD(selectedDate);
    const cat = selectedCategory;
    document.getElementById("hid-category").value = cat;

    // Send a get req to the server to get the booking data
    const resp = await fetch (
        '/booking/data?date=' + encodeURIComponent(dateStr) // add the date in url
        + '&category=' + encodeURIComponent(cat) // add the category in url
    );
    const data = await resp.json(); // { rooms: [{room, slots:[{time,status}]}] }

    data.rooms.forEach((r, idx) => {
    // Row wrapper for each room
    const row = document.createElement("div");
    row.classList.add("room-row");
    list.appendChild(row);

    // Room name (left column)
    const roomName = document.createElement("span");
    roomName.textContent = r.room;
    roomName.classList.add("room-name");
    row.appendChild(roomName);

    // Container for time buttons (right column)
    const timesContainer = document.createElement("div");
    timesContainer.classList.add("room-times");
    row.appendChild(timesContainer);

    let any = false;

    r.slots.forEach(slot => {
        if (slot.status === 'free') {
            const btn = document.createElement("button");
            btn.classList.add("pill-btn");
            btn.textContent = slot.time;
            
            btn.addEventListener("click", () => {
                selectedRoom = r.room;
                selectedTime = slot.time;

                outputRoom.textContent = selectedRoom + " at ";
                outputRoom.style.color = "dodgerblue";
                outputRoom.style.fontWeight = "bold";
                outputTime.textContent = selectedTime;
                outputTime.style.color = "dodgerblue";
                outputTime.style.fontWeight = "bold";

                document.getElementById("hid-room").value = selectedRoom;
                document.getElementById("hid-time").value = selectedTime;

                document.querySelectorAll(".pill-btn")
                        .forEach(b => b.classList.remove("pill-btn-active"));
                btn.classList.add("pill-btn-active");

                logSelection();
            });

            timesContainer.appendChild(btn);
            any = true;
        }
    });

    if (!any) {
        timesContainer.textContent = "No times available for this room.";
    }
});
}

function logSelection() {
    const d = selectedDate ? selectedDate.toISOString().slice(0,10) : 'None';
    console.log('[selection]', {
        category: selectedCategory,
        date: d,
        room: selectedRoom || 'None',
        time: selectedTime || 'None'
    });
}

// Error form handler
const form = document.getElementById("form");
const purpose = document.getElementById("purpose");
const errorElement = document.getElementById("error"); // where we are gonna display the errors (in the error div)

form.addEventListener("submit", (e) => {
    const messages = []; // Store the error messages

    if (!selectedDate) 
        messages.push("No date selected!");

    if (!document.getElementById("hid-room").value || !document.getElementById("hid-time").value) 
        messages.push("No time selected!");

    if (purpose.value === "none-selected") 
        messages.push("A purpose for the booking is required!");

    if (messages.length) { 
        e.preventDefault(); // Prevents form from submitting
        errorElement.innerHTML = messages.join("<br>"); // line break
        errorElement.classList.add("error"); // add styling
    }
});