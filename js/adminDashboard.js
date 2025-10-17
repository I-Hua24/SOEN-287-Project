    (function(){
      const role = localStorage.getItem("userRole");
      if (role !== "admin") {
        alert("Access denied. Admins only.");
        //window.location.href = "../index.html";
      }
    })();

    // Very light demo wiring (replace with real data later)
    document.addEventListener("DOMContentLoaded", () => {
      // Fake stats
      document.getElementById("stat-total-bookings").textContent = "1,284";
      document.getElementById("stat-pending").textContent = "7";
      document.getElementById("stat-resources").textContent = "86";
      document.getElementById("stat-utilization").textContent = "62%";

      // Modal open/close
      const addBtn = document.getElementById("add-resource");
      const addModal = document.getElementById("modal-add-resource");
      const closeAdd = document.getElementById("close-add-modal");
      const cancelAdd = document.getElementById("cancel-add");
      const saveAdd = document.getElementById("save-add");

      const confirmModal = document.getElementById("modal-confirm");
      const confirmMsg = document.getElementById("confirm-message");
      const confirmOk = document.getElementById("confirm-ok");
      const confirmCancel = document.getElementById("confirm-cancel");
      const closeConfirm = document.getElementById("close-confirm-modal");

      function open(el){ el.classList.add("active"); }
      function close(el){ el.classList.remove("active"); }

      addBtn?.addEventListener("click", ()=> open(addModal));
      closeAdd?.addEventListener("click", ()=> close(addModal));
      cancelAdd?.addEventListener("click", ()=> close(addModal));
      saveAdd?.addEventListener("click", ()=> {
        // TODO: validate + push to storage
        alert("Resource saved (demo).");
        close(addModal);
      });

      // Actions on bookings/resources (approve/reject/etc.)
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

      // Filters (demo)
      document.getElementById("apply-filters")?.addEventListener("click", ()=> {
        alert("Filters applied (demo).");
      });
      document.getElementById("reset-filters")?.addEventListener("click", ()=> {
        ["filter-from","filter-to","filter-type","filter-status","filter-search"].forEach(id=>{
          const el = document.getElementById(id);
          if(!el) return;
          if(el.tagName === "SELECT" || el.type === "text" || el.type === "date") el.value = "";
        });
      });
    });
