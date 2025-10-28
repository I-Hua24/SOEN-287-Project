// Structure:
//
// days(array) that holds day(obj's) that has categories(array) that holds the room(obj's)
//
// (days.length = maxBookingInFuture + 1)
//
// days[].day
//       .month
//       .year
//       .categories[0-3][roomNumber].roomOpen
//                                   .nameOnRoom
//                                   .roomNum
//                                   .time


const username = "Username"; // Rooms will be stored with this nam    // normalize inputs
    const roomIdx = parseInt(selectedRoom.replace(/\D/g, ""), 10) - 1; // "Room 3" -> 2
    const hour = parseInt(selectedTime.split(":")[0], 10); // "12:00" -> 12

    // find slot and book
    const slot = cat.find(s => s.roomNum === roomIdx && s.time === hour);
    if (!slot) 
    {
        console.log("Log failed, slot doesnt exist");
        return false;
    }
    else
    {
        let output = "Room " + (slot.roomNum + 1) + ", Time: " + slot.time;
        if (slot.roomOpen === false)
        {
            output += ", Name: " + slot.nameOnRoom;
        }
        else
        {
            output += ", Room open";
        }
        console.log(output);
    }

    return true;
}

// Args ex: 0-4, new Date(2024, 9, 6), "Room 2", "12:00"
function bookRoom(selectedCategory, selectedDate, selectedRoom, selectedTime, name) 
{
    // find the day
    const dIdx = days.findIndex(d =>
        d.year === selectedDate.getFullYear() &&
        d.month === (selectedDate.getMonth() + 1) &&
        d.day === selectedDate.getDate()
    );
    if (dIdx < 0) return false;

    let cat;
    if (days[dIdx].category !== null && days[dIdx].category !== undefined) 
    {
        cat = days[dIdx].category[selectedCategory];
    } 
    else 
    {
        cat = undefined;
    }
    if (!Array.isArray(cat)) return false;

    // normalize inputs
    const roomIdx = parseInt(selectedRoom.replace(/\D/g, ""), 10) - 1; // "Room 3" -> 2
    const hour = parseInt(selectedTime.split(":")[0], 10); // "12:00" -> 12

    // find slot and book
    const slot = cat.find(s => s.roomNum === roomIdx && s.time === hour);
    if (!slot || !slot.roomOpen) return false;

    slot.roomOpen = false;
    slot.nameOnRoom = name; // put your user input here
    return true;
}
// Retuns the an array of the bookings for a user
function getBookings(username)
{
    let bookings = [];

    for (let d = 0; d < days.length; d++)
    {
        const currentDay = days[d];
        // const dateStr = currentDay.day + "/" + currentDay.month + "/" + currentDay.year;
        const dateObj = new Date(currentDay.year, currentDay.month - 1, currentDay.day);

        for (let c = 0; c < currentDay.category.length; c++)
        {
            const cat = currentDay.category[c];

            for (let s = 0; s < cat.length; s++)
            {
                const slot = cat[s];

                // Check if this slot belongs to the user
                if (slot.nameOnRoom && slot.nameOnRoom.toLowerCase() === username.toLowerCase())
                {
                    bookings.push("Date: " + dateObj.toString().slice(0, 15) + ", Category: " + c + ", Room " + (slot.roomNum + 1) + ", Time: " + slot.time + ":00");
                }
            }
        }
    }

    // If no bookings were found
    if (bookings.length === 0)
    {
        console.log("No bookings found for user: " + username);
        return false;
    }

    return bookings;
}
// Args ex: 0-4, new Date(2024, 9, 6), "Room 2", "12:00"
function cancelABooking(selectedCategory, selectedDate, selectedRoom, selectedTime)
{
    // Find the day
    const dIdx = days.findIndex(d =>
        d.year === selectedDate.getFullYear() &&
        d.month === (selectedDate.getMonth() + 1) &&
        d.day === selectedDate.getDate()
    );
    if (dIdx < 0) return false;

    // Get the category list
    let cat;
    if (days[dIdx].category !== null && days[dIdx].category !== undefined) 
    {
        cat = days[dIdx].category[selectedCategory];
    } 
    else 
    {
        cat = undefined;
    }
    if (!Array.isArray(cat)) return false;

    // Normalize inputs ("Room 3" -> 2, "12:00" -> 12)
    const roomIdx = parseInt(selectedRoom.replace(/\D/g, ""), 10) - 1; // "Room 3" -> 2
    const hour = parseInt(selectedTime.split(":")[0], 10); // "12:00" -> 12

    // Find the matching slot
    const slot = cat.find(s => s.roomNum === roomIdx && s.time === hour);
    if (!slot) return false;

    // 5 If booked, clear it and save
    if (!slot.roomOpen) 
    {
        slot.roomOpen = true;
        slot.nameOnRoom = "";
        saveDays(); // save it to local storage
        console.log("Booking canceled and saved.");
        return true;
    }

    console.log("Cancel failed: room was already open.");
    return false;
}
// Resets all bookings back to default values
function resetAllBookings()
{
    for (let d = 0; d < days.length; d++)
    {
        const currentDay = days[d];

        for (let c = 0; c < currentDay.category.length; c++)
        {
            const cat = currentDay.category[c];

            for (let s = 0; s < cat.length; s++)
            {
                const slot = cat[s];
                slot.roomOpen = true;
                slot.nameOnRoom = "";
            }
        }
    }

    console.log("All bookings have been reset.");
    saveDays(); // save to local storage
}

// Update local storage
function saveDays() 
{
    localStorage.setItem("days", JSON.stringify(days));
}
// Check if the days data is already created/stored, otherwise create it.
function loadDays() {
    const stored = localStorage.getItem("days");
    if (stored) 
    {
        days = JSON.parse(stored);
        console.log("Loaded from local storage:", days);
    } 
    else 
    {
        console.log("No previous data found, starting fresh.");
    }
}
