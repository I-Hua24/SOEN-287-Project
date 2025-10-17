
const currentBookings = document.getElementById("current-bookings");
currentBookings.innerHTML = "";

const bookingDiv = document.createElement("div");
bookingDiv.classList.add("sec");

const pastBookings = document.getElementById("past-bookings");

renderBookings();

function renderBookings()
{
    let bookingsArr = getBookings(username);

    if (bookingsArr > 1) console.log("Bookings:\n" + bookingsArr.join("\n"));

    bookingDiv.replaceChildren(); // refreshes
    pastBookings.replaceChildren();

    let areCurrentBookings = false; // flag to disable/enable "You have no bookings message"

    if (bookingsArr.length > 0)
    {
        for (let i = 0; i < bookingsArr.length; i++)
        {
            // Display room info
            let date = bookingsArr[i].slice(6, 21); // get the date
            let cat = bookingsArr[i][33]; // char pos
            let room = bookingsArr[i][41];
            let time = bookingsArr[i].slice(50, 55);

            // Convert category num to its string name
            let catStr;
            if (cat == 0) catStr = "Study Room";
            if (cat == 1) catStr = "Sports Facility";
            if (cat == 2) catStr = "Specialized Equipment";
            if (cat == 3) catStr = "Software Seats";

            // Add the html for the room info
            const p = document.createElement("p");
            p.classList.add("left");
            p.innerHTML = "<div class=\"sec\"><p class=\"left\"><b><span class='booked-room-type'>" + catStr + " " + room + ",</span></b>" + "<span class='booked-date'> " + date + "</span> at " + "<span class='booked-time'> " + time + "</span></p></div>";

            // Check if booking is past, if so add to past bookings instead
            const now = new Date();
            const bookingDate = new Date(date);
            const hour = time.split(":")[0]; // take only whats before the colon
            bookingDate.setHours(hour, 0, 0, 0);

            if (bookingDate < now)
            {
                // const noPastBookingText = document.getElementById("no-past-bookings");
                // noPastBookingText.classList.add("hide");

                pastBookings.appendChild(p);
                continue;
            }

            areCurrentBookings = true;

            // Create the modify and cancel buttons
            const rightDiv = document.createElement("div");
            rightDiv.classList.add("right");

            // Cancel button
            const cancelButton = document.createElement("button");
            cancelButton.classList.add("cancel-pill-btn");
            cancelButton.textContent = "Cancel";

            cancelButton.addEventListener("click", () => {
                console.log("Trying to cancel:", cat, room, date, time);

                const selectedDate = new Date(date);

                // Call the cancel functiion with correct formatten args
                cancelABooking(cat, selectedDate, "Room " + room, time);

                renderBookings(); // Re render so screen updates to correct info
            });

            rightDiv.appendChild(cancelButton);
            bookingDiv.appendChild(p);
            bookingDiv.appendChild(rightDiv);
            currentBookings.appendChild(bookingDiv);
        }
    }

    // Hide or show the no bookings message if user is booked in a room.
    const noBookingsID = document.getElementById("no-bookings");
    if (areCurrentBookings)
    {
        noBookingsID.classList.add("hide");
    }
    else
    {
        noBookingsID.classList.remove("hide");
    }

}