// Combined notifications.js - Using Database
document.addEventListener("DOMContentLoaded", () => {
    // Get all elements once
    const message = document.getElementById("adminMessage");
    const sendNotificationBtn = document.getElementById("sendNotificationBtn");
    const notifIcon = document.getElementById("notif-icon");
    const notifPanel = document.getElementById("notif-panel");
    const notifCount = document.getElementById("notif-count");
    const notifList = document.getElementById("notif-list");

    // BACKEND BASE URL - ADD THIS
    const BACKEND_URL = 'http://localhost:8000';

    // Get user info
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // DEBUG LOGS
    console.log("DEBUG: Logged in user:", loggedInUser);
    console.log("DEBUG: Backend URL:", BACKEND_URL);

    // 1. LOAD NOTIFICATIONS FROM DATABASE - UPDATED
    async function loadNotifications() {
        try {
            console.log("DEBUG: Loading notifications from API...");
            const response = await fetch(`${BACKEND_URL}/api/notifications`, {
                credentials: 'include'
            });

            console.log("DEBUG: Response status:", response.status);
            console.log("DEBUG: Content type:", response.headers.get('content-type'));

            // First, get the response as text to see what we're actually getting
            const responseText = await response.text();
            console.log("DEBUG: Response text (first 500 chars):", responseText.substring(0, 500));

            if (response.ok) {
                try {
                    // Try to parse as JSON
                    const notifications = JSON.parse(responseText);
                    console.log("DEBUG: Notifications loaded:", notifications);
                    displayNotifications(notifications);
                } catch (parseError) {
                    console.error("DEBUG: Failed to parse JSON:", parseError);
                    console.error("DEBUG: Raw response:", responseText);
                    // Fallback to localStorage
                    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
                    displayNotifications(storedNotifications);
                }
            } else {
                console.error('Failed to fetch notifications, status:', response.status);
                // Fallback to localStorage if API fails
                const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
                displayNotifications(storedNotifications);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            // Fallback to localStorage
            const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
            displayNotifications(storedNotifications);
        }
    }
    function displayNotifications(notifications) {
        if (notifList) {
            notifList.innerHTML = "";
            if (notifications.length === 0) {
                notifList.innerHTML = "<li>No notifications available</li>";
            } else {
                notifications.forEach(notification => {
                    const typeClass = notification.type || "general";
                    const timestamp = new Date(notification.createdAt || notification.timestamp).toLocaleString();
                    notifList.innerHTML += `
                        <li class="notification-item ${typeClass}">
                            ${notification.message}
                            <br>
                            <small>${timestamp}</small>
                        </li>`;
                });
            }
        }

        // Update notification count
        if (notifCount) {
            notifCount.textContent = notifications.length;
        }
    }

    // 2. ADMIN SEND NOTIFICATIONS - UPDATED WITH ABSOLUTE URL
    if (sendNotificationBtn && message) {
        sendNotificationBtn.addEventListener("click", async () => {
            const notificationText = message.value.trim();
            console.log("DEBUG: Sending notification:", notificationText);

            if (notificationText === "") {
                alert("Please enter a message before sending.");
                return;
            }

            //Get the existing notifications from localStorage
            try {
                const user = JSON.parse(localStorage.getItem('loggedInUser'));
                console.log("DEBUG: User sending notification:", user);

                // Try API first - USING ABSOLUTE URL
                const response = await fetch(`${BACKEND_URL}/api/notifications`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // ADD THIS FOR COOKIES/AUTH
                    body: JSON.stringify({
                        message: notificationText,
                        type: "announcement",
                        createdBy: user?.email || user?.username || 'Admin'
                    })
                });

                console.log("DEBUG: API response status:", response.status);

                if (response.ok) {
                    const newNotification = await response.json();
                    console.log("DEBUG: Notification created via API:", newNotification);
                    alert("Notification sent to all users via database!");
                    message.value = "";
                    loadNotifications();
                } else {
                    // FALLBACK: Use localStorage if API fails
                    console.warn("DEBUG: API failed, using localStorage fallback");
                    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];

                    const newNotification = {
                        message: notificationText,
                        timestamp: new Date().toISOString(),
                        type: "announcement"
                    };

                    storedNotifications.push(newNotification);
                    localStorage.setItem("notifications", JSON.stringify(storedNotifications));

                    alert("Error: Notification saved locally (Database not available)");
                    message.value = "";
                    loadNotifications();
                }
            } catch (error) {
                console.error('Error sending notification:', error);
                alert("Error: " + error.message);
            }
        });
    }

    // 3. NOTIFICATION PANEL TOGGLE (keep your existing working code)
    if (notifIcon && notifPanel) {
        notifIcon.addEventListener("click", (event) => {
            // Prevent it from instantly closing when clicked
            event.stopPropagation();
            notifPanel.classList.toggle("hidden");

            if (!notifPanel.classList.contains("hidden")) {
                // Load fresh notifications when panel opens
                loadNotifications();
                if (notifCount) {
                    notifCount.textContent = "0"; // Reset count when opened
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

    // 4. SHOW/HIDE NOTIFICATION ICON BASED ON LOGIN STATUS
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

    // 5. Load notifications when page loads
    loadNotifications();
});