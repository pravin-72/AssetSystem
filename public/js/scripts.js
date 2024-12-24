$(document).ready(function () {
  $(".menu-link").click(function (e) {
    e.preventDefault();
    const target = $(this).data("target");

    // Fetch and load content dynamically
    $(".content").load(target + " .content");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const editBtns = document.querySelectorAll(".edit-btn");
  const deleteBtns = document.querySelectorAll(".delete-btn");

  // Edit category
  editBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");

      document.getElementById("editId").value = id;
      document.getElementById("editCategoryName").value = name;

      $("#editModal").modal("show");
    });
  });

  // Delete category
  deleteBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this category?")) {
        window.location.href = `/categories/delete/${id}`;
      }
    });
  });
});
