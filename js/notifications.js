//Bonus section


//Admin send notifications to student
document.addEventListener("DOMContentLoaded", () => {
    const message = document.getElementById("adminMessage");
    const sendNotificationBtn = document.getElementById("sendNotificationBtn");

    if (message && sendNotificationBtn) {
        sendNotificationBtn.addEventListener("click", () => {
            const notificationText = message.value.trim();
            if (notificationText === "") {
                alert("Please enter a message before sending.");
                return;
            }
            //Get the existing notifications from localStorage
            const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];

            const newNotification = {
                message: notificationText,
                timestamp: new Date().toISOString()
            }

            storedNotifications.push(newNotification);

            try {
                localStorage.setItem("notifications", JSON.stringify(storedNotifications));

                alert("Notification sent to all users.");
            } catch (e) {
                console.error("Error saving notification:", e);
                alert("Failed to send notification. Please try again.");
            }
            message.value = "";
        })
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const notifIcon = document.getElementById("notif-icon");
    const notifPanel = document.getElementById("notif-panel")
    const notifCount = document.getElementById("notif-count");
    const notifList = document.getElementById("notif-list");

    if (notifIcon && notifPanel) {
        notifIcon.addEventListener("click", (event) => {

            // Prevent it from instantly closing when clicked inside
            event.stopPropagation();
            notifPanel.classList.toggle("hidden");

        if (!notifPanel.classList.contains("hidden")) {
            notifCount.textContent = 0;
        }

        });

        //Close the pannel
        document.addEventListener("click", () => {
            if (!notifPanel.classList.contains("hidden")) {
                notifPanel.classList.add("hidden");
            }
        });
    }
})

//Student data fetched
document.addEventListener("DOMContentLoaded", () => {

    const notifIcon = document.getElementById("notif-icon");
    const notifCount = document.getElementById("notif-count");
    const notifList = document.getElementById("notif-list");


    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];

    const loggedInUser = localStorage.getItem("loggedInUser");
    const userRole = localStorage.getItem("userRole");

    notifList.innerHTML = "";
    if (storedNotifications.length === 0) {
        notifList.innerHTML = "<li>No notifications available</li>";
    }


    if (loggedInUser && userRole === "student") {
        storedNotifications.forEach(notification => {
            notifList.innerHTML += `
    <li>
      ${notification.message}
      <br>
      <small>${new Date(notification.timestamp).toLocaleString()}</small>
    </li>`;
        });


    }

    notifCount.textContent = storedNotifications.length;

    if (!loggedInUser || userRole !== "student") {
        notifIcon.style.display = "none";

    }
});

//Notification when student book a spot or if an admin cancelled/changed


