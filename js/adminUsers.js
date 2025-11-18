// Store all users for filtering
let allUsers = [];

// Display all users
async function DisplayAllUser() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/admin/users", {
            method: "GET",
            credentials: "include"
        });

        console.log("API status:", response.status);

        if (!response.ok) {
            const text = await response.text();
            console.log("API error body:", text);
            alert("Error fetching User Data");
            return;
        }

        const data = await response.json();
        console.log("Users fetched", data);
        
        allUsers = data.users || data;
        renderUsers(allUsers);

    } catch (err) {
        console.error("JS Runtime error:", err);
        alert("Error fetching User Data");
    }
}

// Render users to table
function renderUsers(users) {
    const tableBody = document.getElementById("users-table-body");
    if (!tableBody) {
        console.error("users-table-body not found in HTML");
        return;
    }

    tableBody.innerHTML = "";

    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
                    No users found
                </td>
            </tr>
        `;
        return;
    }

    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
                <button class="action-btn change-role" data-user-id="${user.id || user._id}" data-user-email="${user.email}">Change Role</button>
                <button class="action-btn delete" data-user-id="${user.id || user._id}" data-user-email="${user.email}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Attach event listeners to buttons
    attachButtonListeners();
    console.log("Table rendering done.");
}

// Attach event listeners to action buttons
function attachButtonListeners() {
    // Change Role buttons
    const changeRoleButtons = document.querySelectorAll(".change-role");
    changeRoleButtons.forEach(btn => {
        btn.addEventListener("click", handleChangeRole);
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", handleDelete);
    });
}

// Handle role change
async function handleChangeRole(e) {
    const userId = e.target.dataset.userId;
    const userEmail = e.target.dataset.userEmail;
    
    // Find current user
    const user = allUsers.find(u => (u.id || u._id) == userId);
    const currentRole = user ? user.role : 'student';
    
    // Prompt for new role
    const newRole = prompt(
        `Change role for ${userEmail}\nCurrent role: ${currentRole}\n\nEnter new role (admin/student):`,
        currentRole
    );
    
    if (!newRole) return; // User cancelled
    
    if (newRole !== 'admin' && newRole !== 'student') {
        alert("Invalid role! Please enter 'admin' or 'student'");
        return;
    }
    
    try {
        console.log(`Attempting to change role for user ${userId} to ${newRole}`);
        
        const response = await fetch(`http://127.0.0.1:8000/api/admin/updateUserRole`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                id: userId,  // Backend expects 'id', not 'userId'
                role: newRole 
            })
        });

        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const text = await response.text();
            console.error("API error response:", text);
            
            // Try to parse error message
            let errorMessage = "Error changing user role";
            try {
                const errorData = JSON.parse(text);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = text || errorMessage;
            }
            
            alert(`Error: ${errorMessage}`);
            return;
        }

        const data = await response.json();
        console.log("Role change response:", data);
        
        alert(`Role changed to ${newRole} successfully!`);
        DisplayAllUser(); // Refresh the list
        
    } catch (err) {
        console.error("Error changing role:", err);
        alert(`Error changing user role: ${err.message}`);
    }
}

// Handle delete
async function handleDelete(e) {
    const userId = e.target.dataset.userId;
    const userEmail = e.target.dataset.userEmail;
    
    const confirm = window.confirm(`Are you sure you want to delete user: ${userEmail}?`);
    if (!confirm) return;
    
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) {
            const text = await response.text();
            console.log("API error body:", text);
            alert("Error deleting user");
            return;
        }

        alert("User deleted successfully!");
        DisplayAllUser(); // Refresh the list
        
    } catch (err) {
        console.error("Error deleting user:", err);
        alert("Error deleting user");
    }
}

// Filter and search functionality
function filterUsers() {
    const searchTerm = document.getElementById("user-search").value.toLowerCase();
    const roleFilterElement = document.getElementById("role-filter");
    const roleFilter = roleFilterElement ? roleFilterElement.value : "";
    
    console.log("Filter - Search term:", searchTerm);
    console.log("Filter - Role filter:", roleFilter);
    console.log("Filter - All users:", allUsers);
    
    let filtered = [...allUsers];
    
    // Filter by search term (email or username)
    if (searchTerm) {
        filtered = filtered.filter(user => 
            user.email.toLowerCase().includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by role
    if (roleFilter && roleFilter !== "All Roles" && roleFilter !== "") {
        // Map "Regular" or "regular" to "student", "Admin" or "admin" stays as "admin"
        let targetRole;
        const lowerRoleFilter = roleFilter.toLowerCase();
        
        if (lowerRoleFilter === "regular") {
            targetRole = "student";
        } else if (lowerRoleFilter === "admin") {
            targetRole = "admin";
        } else {
            targetRole = lowerRoleFilter;
        }
        
        console.log("Filter - Target role:", targetRole);
        
        filtered = filtered.filter(user => {
            const userRole = user.role.toLowerCase();
            console.log("Filter - Comparing user role:", userRole, "with target:", targetRole);
            return userRole === targetRole;
        });
    }
    
    console.log("Filter - Filtered users:", filtered);
    renderUsers(filtered);
}

// Reset filters
function resetFilters() {
    document.getElementById("user-search").value = "";
    document.getElementById("role-filter").value = "All Roles";
    renderUsers(allUsers);
}

// Event listeners for filter controls
document.addEventListener("DOMContentLoaded", () => {
    const applyBtn = document.getElementById("filter-btn");
    const resetBtn = document.getElementById("reset-btn");
    const searchInput = document.getElementById("user-search");
    
    if (applyBtn) {
        applyBtn.addEventListener("click", filterUsers);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener("click", resetFilters);
    }
    
   /* if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                filterUsers();
            }
       });
    }
    */
    // Initial load
    DisplayAllUser();
});