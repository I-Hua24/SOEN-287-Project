//Bonus section
//Admin send notifications to student
// Combined notifications.js - Single DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
    // Get all elements once
    const message = document.getElementById("adminMessage");
    const sendNotificationBtn = document.getElementById("sendNotificationBtn");
    const notifIcon = document.getElementById("notif-icon");
    const notifPanel = document.getElementById("notif-panel");
    const notifCount = document.getElementById("notif-count");
    const notifList = document.getElementById("notif-list");

    // Get user info
    const loggedInUser = localStorage.getItem("loggedInUser");
    const userRole = localStorage.getItem("userRole");

    // DEBUG LOGS
    console.log("DEBUG: Logged in user:", loggedInUser);
    console.log("DEBUG: User role:", userRole);
    console.log("DEBUG: Notification icon:", notifIcon);

    // 1. ADMIN SEND NOTIFICATIONS
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
                timestamp: new Date().toISOString(),
                type: "announcement"
            };

            storedNotifications.push(newNotification);

            try {
                localStorage.setItem("notifications", JSON.stringify(storedNotifications));
                alert("Notification sent to all users.");

                // Update notification count immediately
                if (notifCount) {
                    notifCount.textContent = storedNotifications.length;
                }
            } catch (e) {
                console.error("Error saving notification:", e);
                alert("Failed to send notification. Please try again.");
            }
            message.value = "";
        });
    }

    // 2. NOTIFICATION PANEL TOGGLE
    if (notifIcon && notifPanel) {
        notifIcon.addEventListener("click", (event) => {

            // Prevent it from instantly closing when clicked
            event.stopPropagation();
            notifPanel.classList.toggle("hidden");

            if (!notifPanel.classList.contains("hidden")) {
                // Reset count when panel is opened
                if (notifCount) {
                    notifCount.textContent = "0";
                }
            }
        });

        // Close panel when clicking elsewhere
        document.addEventListener("click", () => {
            if (!notifPanel.classList.contains("hidden")) {
                notifPanel.classList.add("hidden");
            }
        });
    }

    // 3. LOAD AND DISPLAY NOTIFICATIONS
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];

    // Clear and populate notification list
    if (notifList) {
        notifList.innerHTML = "";
        if (storedNotifications.length === 0) {
            notifList.innerHTML = "<li>No notifications available</li>";
        } else if (loggedInUser) {
            storedNotifications.forEach(notification => {
                const typeClass = notification.type || "general";
                notifList.innerHTML += `
                    <li class="notification-item ${typeClass}">
                        ${notification.message}
                        <br>
                        <small>${new Date(notification.timestamp).toLocaleString()}</small>
                    </li>`;
            });
        }
    }

    // 4. SHOW/HIDE NOTIFICATION ICON BASED ON LOGIN STATUS - WITH DELAY
    setTimeout(() => {
        if (notifIcon) {
            // Re-check localStorage after delay
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            console.log("DEBUG: After delay - loggedInUser:", loggedInUser);

            if (!loggedInUser) {
                console.log("DEBUG: Hiding icon - no user logged in");
                notifIcon.style.display = "none";
            } else {
                console.log("DEBUG: Showing icon - user is logged in");
                notifIcon.style.display = "flex";
            }
        }
    }, 1500); //  Wait 1.5 seconds for authentication to complete

    // 5. UPDATE NOTIFICATION COUNT
    if (notifCount) {
        notifCount.textContent = storedNotifications.length;
    }
});