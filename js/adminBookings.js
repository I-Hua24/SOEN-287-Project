document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#bookings-table tbody");
  const statusFilter = document.getElementById("booking-status-filter");
  const refreshBtn = document.getElementById("refresh-bookings-btn");
  const messageEl = document.getElementById("bookings-message");

  async function loadBookings() {
    messageEl.textContent = "Loading bookings...";
    tableBody.innerHTML = "";

    try {
      const params = new URLSearchParams();
      const status = statusFilter.value;
      if (status) params.append("status", status);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`, {
        credentials: "include", // send cookies/JWT
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const bookings = data.bookings || [];

      if (bookings.length === 0) {
        messageEl.textContent = "No bookings found for this filter.";
        return;
      }

      messageEl.textContent = "";

      bookings.forEach((b, idx) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${idx+1}</td>
          <td>${b.user ? b.user.email || b.user : "N/A"}</td>
          <td>${b.room || "N/A"}</td>
          <td>${b.date}</td>
          <td>${b.time}</td>
          <td>${b.category || "-"}</td>
          <td class="booking-status">${b.status}</td>
          <td>
            <button class="btn-approve" data-room-id="${b.roomId}" data-slot-index="${b.slotIndex}">
              Approve
            </button>
            <button class="btn-reject" data-room-id="${b.roomId}" data-slot-index="${b.slotIndex}">
              Reject
            </button>
            <button class="btn-cancel" data-room-id="${b.roomId}" data-slot-index="${b.slotIndex}">
              Cancel
            </button>
          </td>
        `;

        // Disable actions based on status
        const approveBtn = tr.querySelector(".btn-approve");
        const rejectBtn = tr.querySelector(".btn-reject");
        const cancelBtn = tr.querySelector(".btn-cancel");

        if (b.status === "pending") {
          // can approve or reject
          cancelBtn.disabled = true;
        } else if (b.status === "booked") {
          // can cancel but not approve/reject
          approveBtn.disabled = true;
          rejectBtn.disabled = true;
        } else {
          // free or other
          approveBtn.disabled = true;
          rejectBtn.disabled = true;
          cancelBtn.disabled = true;
        }

        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      messageEl.textContent = "Error loading bookings. Please try again.";
    }
  }

  async function updateBooking(roomId, slotIndex, action) {
    if (!roomId || slotIndex === undefined) return;

    try {
      const res = await fetch(
        `/api/admin/bookings/${roomId}/slots/${slotIndex}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ action }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.message || `HTTP ${res.status}`;
        alert(`Failed to ${action} booking: ${msg}`);
        return;
      }

      // Option 1: reload everything
      await loadBookings();

      // Option 2: update status in-place (if you want to optimize)
    } catch (err) {
      console.error(err);
      alert(`Error when trying to ${action} booking.`);
    }
  }

  // Event listeners

  statusFilter.addEventListener("change", loadBookings);
  refreshBtn.addEventListener("click", loadBookings);

  // Use event delegation for buttons inside the table
  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const roomId = target.getAttribute("data-room-id");
    const slotIndex = target.getAttribute("data-slot-index");

    if (target.classList.contains("btn-approve")) {
      updateBooking(roomId, slotIndex, "approve");
    } else if (target.classList.contains("btn-reject")) {
      updateBooking(roomId, slotIndex, "reject");
    } else if (target.classList.contains("btn-cancel")) {
      updateBooking(roomId, slotIndex, "cancel");
    }
  });

  // Initial load
  loadBookings();
});
