document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#resources-table tbody");
  const messageEl = document.getElementById("resources-message");
//  const searchInput = document.getElementById("resource-search");
  const refreshBtn = document.getElementById("refresh-resources-btn");

  let allResources = [];

  function formatDate(dateString) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "-";
    // e.g. 2025-10-15
    return d.toISOString().slice(0, 10);
  }

  function renderResources() {
    // const query = (searchInput.value || "").toLowerCase().trim();
    tableBody.innerHTML = "";

    const filtered = allResources.filter((r) => {
      if (!query) return true;
      const haystack = (
        (r.name || "") +
        " " +
        (r.type || "") +
        " " +
        (r.location || "")
      ).toLowerCase();
      return haystack.includes(query);
    });

    if (filtered.length === 0) {
      messageEl.textContent = query
        ? "No resources match your search."
        : "No resources found.";
      return;
    }

    messageEl.textContent = "";

    filtered.forEach((r) => {
      const tr = document.createElement("tr");

      const availableText =
        r.availableFrom && r.availableTo
          ? `${formatDate(r.availableFrom)} → ${formatDate(r.availableTo)}`
          : "-";

      const statusLabel = r.isBlocked ? "Blocked" : "Active";

      tr.innerHTML = `
        <td>${r.name}</td>
        <td>${r.type}</td>
        <td>${r.location}</td>
        <td>${r.capacity}</td>
        <td>${availableText}</td>
        <td class="resource-status ${r.isBlocked ? "status-blocked" : "status-active"}">
          ${statusLabel}
        </td>
        <td>
          <button
            class="btn-small btn-toggle-block"
            data-id="${r._id}"
            data-blocked="${r.isBlocked ? "true" : "false"}"
          >
            ${r.isBlocked ? "Unblock" : "Block"}
          </button>
          <button class="btn-small btn-edit" data-id="${r._id}">
            Edit
          </button>
          <button class="btn-small btn-delete" data-id="${r._id}">
            Delete
          </button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  }

  async function loadResources() {
    messageEl.textContent = "Loading resources…";
    tableBody.innerHTML = "";

    try {
      const res = await fetch("/api/admin/resources", {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      allResources = data.resources || [];
      renderResources();
    } catch (err) {
      console.error(err);
      messageEl.textContent =
        "Error loading resources. Please try again later.";
    }
  }

  async function toggleBlock(resourceId, currentlyBlocked) {
    try {
      const res = await fetch(`/api/admin/resources/${resourceId}/block`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isBlocked: !currentlyBlocked }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.message || `HTTP ${res.status}`;
        alert("Failed to update resource status: " + msg);
        return;
      }

      await loadResources();
    } catch (err) {
      console.error(err);
      alert("Error when updating resource status.");
    }
  }

  async function deleteResource(resourceId) {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const res = await fetch(`/api/admin/resources/${resourceId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData.message || `HTTP ${res.status}`;
        alert("Failed to delete resource: " + msg);
        return;
      }

      await loadResources();
    } catch (err) {
      console.error(err);
      alert("Error when deleting resource.");
    }
  }

  // Event listeners
  // searchInput.addEventListener("input", () => {
    // renderResources();
  // });

  refreshBtn.addEventListener("click", () => {
    loadResources();
  });

  tableBody.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;

    const id = target.getAttribute("data-id");
    if (!id) return;

    if (target.classList.contains("btn-toggle-block")) {
      const blocked = target.getAttribute("data-blocked") === "true";
      toggleBlock(id, blocked);
    } else if (target.classList.contains("btn-delete")) {
      deleteResource(id);
    } else if (target.classList.contains("btn-edit")) {
      // here you could open a modal, or navigate to /admin/resources/:id/edit
      alert("Edit UI not implemented yet (you can add a form/modal for this).");
    }
  });

  // Initial load
  loadResources();
});
