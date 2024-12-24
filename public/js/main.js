document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("assetForm");
  const assetTable = document.getElementById("assetTable");
  const apiUrl = "/assets";

  const fetchAssets = async () => {
    const response = await fetch(apiUrl);
    const assets = await response.json();
    console.log("Fetched assets:", assets); // Debug
    renderAssets(assets);
  };

  const renderAssets = (assets) => {
    assetTable.innerHTML = "";
    assets.forEach((asset) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${asset.type}</td>
        <td>${asset.make}</td>
        <td>${asset.model}</td>
        <td>${asset.serialNumber}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-btn" data-id="${asset.id}">Edit</button>
          <button class="btn btn-danger btn-sm delete-btn" data-id="${asset.id}">Delete</button>
        </td>
      `;
      assetTable.appendChild(row);
    });
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const asset = {
      type: document.getElementById("type").value,
      make: document.getElementById("make").value,
      model: document.getElementById("model").value,
      serialNumber: document.getElementById("serialNumber").value,
    };
    console.log("Submitted asset:", asset); // Debug

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });
      if (response.ok) {
        console.log("Asset added successfully!");

        form.reset();
        fetchAssets();
      } else {
        console.error("Error adding asset:", await response.text());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  });

  assetTable.addEventListener("click", async (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.dataset.id;
      try {
        const response = await fetch(`${apiUrl}/${id}`);
        const asset = await response.json();
        console.log("Editing asset:", asset); // Debug

        // Populate form with asset data
        document.getElementById("type").value = asset.type;
        document.getElementById("make").value = asset.make;
        document.getElementById("model").value = asset.model;
        document.getElementById("serialNumber").value = asset.serialNumber;

        // Handle form submission for updates
        form.onsubmit = async (e) => {
          e.preventDefault();
          const updatedAsset = {
            type: document.getElementById("type").value,
            make: document.getElementById("make").value,
            model: document.getElementById("model").value,
            serialNumber: document.getElementById("serialNumber").value,
          };
          await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedAsset),
          });
          form.reset();
          fetchAssets();
        };
      } catch (err) {
        console.error("Error editing asset:", err);
      }
    }
  });

  assetTable.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this asset?")) {
        try {
          await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          alert("Asset deleted successfully!");
          fetchAssets();
        } catch (err) {
          console.error("Error deleting asset:", err);
          alert("Error deleting asset.");
        }
      }
    }
  });

  fetchAssets();

  document.addEventListener("DOMContentLoaded", () => {
    const deleteBtns = document.querySelectorAll(".delete-btn");

    // Delete category
    deleteBtns.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this asset?")) {
          window.location.href = `/assets/delete/${id}`;
        }
      });
    });
  });
});
