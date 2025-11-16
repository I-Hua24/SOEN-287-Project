document.addEventListener("DOMContentLoaded", async () => {
    console.log("Settings page loaded");

    // --- FIELDS ---
    const usernameField = document.getElementById("username");
    const emailField = document.getElementById("email");

    const currentPasswordField = document.getElementById("currentPassword");
    const newPasswordField = document.getElementById("newPassword");
    const confirmNewPasswordField = document.getElementById("confirmNewPassword");

    const languageField = document.getElementById("language");
    const notificationsField = document.getElementById("notifications");

    const saveSettingsBtn = document.getElementById("save-settings");

    // SAFETY CHECK
    console.log({
        usernameField,
        emailField,
        currentPasswordField,
        newPasswordField,
        confirmNewPasswordField
    });

    // --- LOAD USER INFO ---
    try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            window.location.replace("./signin.html");
            return;
        }

        const data = await response.json();
        const user = data.user;

        usernameField.value = user.username || "";
        emailField.value = user.email || "";
        emailField.readOnly = true;

        languageField.value = user.language || "en";
        notificationsField.checked = user.notifications ?? false;

    } catch (error) {
        console.error("Error loading settings:", error);
    }

    // --- SAVE CHANGES ---
    saveSettingsBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        // Validate password
        const currentPassword = currentPasswordField.value.trim();
        const newPassword = newPasswordField.value.trim();
        const confirmNewPassword = confirmNewPasswordField.value.trim();

        if (newPassword || confirmNewPassword) {
            if (!currentPassword) {
                alert("Enter your current password to change it.");
                return;
            }
            if (newPassword !== confirmNewPassword) {
                alert("New passwords do not match.");
                return;
            }
            if (newPassword.length < 6 || newPassword.length > 12) {
                alert("New password must be 6–12 characters.");
                return;
            }
        }

        const updatedInfo = {
            username: usernameField.value.trim(),
            language: languageField.value,
            notifications: notificationsField.checked
        };

        if (newPassword) {
            updatedInfo.currentPassword = currentPassword;
            updatedInfo.newPassword = newPassword;
        }

        console.log("Sending update:", updatedInfo);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/user/updateInfo", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedInfo)
            });

            const data = await response.json();
            console.log("Update response:", data);

            if (!response.ok) {
                alert(data.message || "Update failed.");
                return;
            }

            alert("Settings updated successfully!");

            // Reset password fields
            currentPasswordField.value = "";
            newPasswordField.value = "";
            confirmNewPasswordField.value = "";

        } catch (error) {
            console.error("Update error:", error);
            alert("An internal error occurred.");
        }
    });
});
