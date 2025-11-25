    document.addEventListener("DOMContentLoaded", async () => {
    
      const res = await fetch("/api/admin/dashboard/stats", {
          credentials: "include"
      });
      const stats = await res.json();
      document.getElementById("stat-total-bookings").textContent = stats.totalBookings;
      document.getElementById("stat-pending").textContent = stats.pendingBookings;
      document.getElementById("stat-resources").textContent = stats.resources;
      document.getElementById("stat-utilization").textContent = stats.utilization;

      const addBtn = document.getElementById("add-resource");
      const addModal = document.getElementById("modal-add-resource");
      const closeAdd = document.getElementById("close-add-modal");
      const cancelAdd = document.getElementById("cancel-add");
      const saveAdd = document.getElementById("save-add");

      // const confirmModal = document.getElementById("modal-confirm");
      // const confirmMsg = document.getElementById("confirm-message");
      // const confirmOk = document.getElementById("confirm-ok");
      // const confirmCancel = document.getElementById("confirm-cancel");
      // const closeConfirm = document.getElementById("close-confirm-modal");

      function open(el){ el.classList.add("active"); }
      function close(el){ el.classList.remove("active"); }

      addBtn?.addEventListener("click", ()=> open(addModal));
      closeAdd?.addEventListener("click", ()=> close(addModal));
      cancelAdd?.addEventListener("click", ()=> close(addModal));
      saveAdd?.addEventListener("click", async ()=> {

          const msgEl = document.getElementById("create-resource-message"); // optional if you add one
          if (msgEl) {
              msgEl.textContent = "";
              msgEl.style.color = "";
          }

          const name = document.getElementById("res-name").value.trim();
          const type = document.getElementById("res-type").value.trim();
          const location = document.getElementById("res-location").value.trim();
          const capacityValue = document.getElementById("res-capacity").value;
          const availabilityFrom = new Date(document.getElementById("add-resource-from").value);
          const availabilityTo = new Date(document.getElementById("add-resource-to").value);

          const capacity = Number(capacityValue);

          if (!name || !type || !location || !availabilityFrom|| !availabilityTo) {
              alert("Please fill in all required fields.");
              return;
          }
          if (!capacity || capacity < 1) {
              alert("Capacity must be at least 1.");
              return;
          }

          const payload = {
              name,
              type,
              location,
              capacity,
              availabilityFrom, // new Date() in backend
              availabilityTo, // new Date() in backend
          };

          try {
              const res = await fetch("/api/admin/resources", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify(payload),
              });

              if (!res.ok) {
                  let errorMsg = `Error: ${res.status}`;
                  try {
                      const data = await res.json();
                      if (data.message) errorMsg = data.message;
                  } catch (_) {}
                  alert(errorMsg);
                  return;
              }

              const data = await res.json();
              const resource = data.resource;
              console.log("Resource created:", data.resource);

              const tbody = document.querySelector("#resources-table tbody");
              if (tbody) {
                  const tr = document.createElement("tr");
                  const fromText = resource.availabilityFrom ? new Date(resource.availabilityFrom).toISOString().slice(0, 10) : availablityFrom
                  const toText = resource.availabilityTo ? new Date(resource.availabilityTo).toISOString().slice(0, 10) : availablityTo

                  tr.innerHTML = `
        <td>${resource.name}</td>
        <td>${resource.type}</td>
        <td>${resource.location}</td>
        <td>${resource.capacity}</td>
        <td>${fromText} -> ${toText}</td>
        <td class="actions">
          <button class="btn ghost" data-action="block"><i class="fa-solid fa-lock"></i> Block</button>
          <button class="btn ghost" data-action="delete"><i class="fa-solid fa-trash"></i> Delete</button>
        </td>
      `;
          // edit button        <button class="btn ghost" data-action="edit"><i class="fa-solid fa-pen"></i> Edit</button>
                  tbody.appendChild(tr);
              }

              document.getElementById("res-name").value = "";
              document.getElementById("res-location").value = "";
              document.getElementById("res-capacity").value = "";
              document.getElementById("res-availability").value = "";
              document.getElementById("res-type").selectedIndex = 0;

              close(addModal);
          } catch (err) {
              console.error(err);
              // alert("Network error while creating resource. Please try again.");
          }
      });
    });

        document.body.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-action]");
        if(!btn) return;
        const action = btn.dataset.action;
        confirmMsg.textContent = `Are you sure you want to ${action} this item?`;
        open(confirmModal);

        const onOk = () => {
          alert(action + " completed (demo).");
          cleanup();
        };
        const onCancel = () => cleanup();

        function cleanup(){
          close(confirmModal);
          confirmOk.removeEventListener("click", onOk);
          confirmCancel.removeEventListener("click", onCancel);
          closeConfirm.removeEventListener("click", onCancel);
        }

        confirmOk.addEventListener("click", onOk);
        confirmCancel.addEventListener("click", onCancel);
        closeConfirm.addEventListener("click", onCancel);
      });

      document.getElementById("apply-filters")?.addEventListener("click", ()=> {
        alert("Filters applied (demo).");
      });
      document.getElementById("reset-filters")?.addEventListener("click", ()=> {
        ["filter-from","filter-to","filter-type","filter-status","filter-search"].forEach(id=>{
          const el = document.getElementById(id);
          if (!el) return;
          if (el.tagName === "SELECT" || el.type === "text" || el.type === "date") el.value = "";
        });
      });
