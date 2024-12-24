$(document).ready(function () {
  // Function to handle search
  function searchEmployees() {
    var searchQuery = $("#search").val();
    var statusFilter = $("#statusFilter").val();

    // Make AJAX request to fetch filtered employees based on search and status
    $.get(
      "/employees",
      { search: searchQuery, status: statusFilter },
      function (employees) {
        var tableBody = $("#employeeTable tbody");
        tableBody.empty(); // Clear the existing table rows

        if (employees.length > 0) {
          employees.forEach(function (employee) {
            tableBody.append(`
            <tr data-id="${employee.id}">
              <td>${employee.id}</td>
              <td>${employee.name}</td>
              <td>${employee.email}</td>
              <td>${employee.status}</td>
              <td>
                <button class="btn btn-warning btn-sm on-edit" data-id="${employee.id}">Edit</button>
                <button class="btn btn-danger btn-sm on-delete" data-id="${employee.id}">Delete</button>
              </td>
            </tr>
          `);
          });
        } else {
          tableBody.append(`<tr><td colspan="5">No employees found.</td></tr>`);
        }
      }
    );
  }

  // Trigger search when search input or status filter changes
  $("#search, #statusFilter").on("input change", function () {
    searchEmployees();
  });

  // Handle search input keyup event (to trigger the search as user types)
  $("#search").keyup(function () {
    searchEmployees();
  });

  $(document).ready(function () {
    searchEmployees();
  });

  // Initial employee fetch
  searchEmployees();

  // Handle Edit button click
  $(document).on("click", ".on-edit", function () {
    var employeeId = $(this).data("id");

    // Fetch employee data based on ID from the backend
    $.get(`/employees/${employeeId}`, function (employee) {
      $("#name").val(employee.name);
      $("#email").val(employee.email);
      $("#status").val(employee.status);

      // Change the form submit button to Update
      $("#employeeForm button").text("Update Employee");

      // Update form action to handle updates
      $("#employeeForm").attr("action", `/employees/${employeeId}`);
      $("#employeeForm").attr("method", "PUT");
    });
  });

  // Correcting the 'Delete' button handler
  $(document).on("click", ".on-delete", function () {
    var employeeId = $(this).data("id");

    // Confirm the deletion
    if (confirm("Are you sure you want to delete this employee?")) {
      $.ajax({
        url: `/employees/${employeeId}`,
        type: "DELETE",
        success: function () {
          $(`tr[data-id="${employeeId}"]`).remove();
        },
        error: function () {
          alert("Error deleting employee.");
        },
      });
    }
  });

  // Handle form submission for adding or updating employee
  $("#employeeForm").submit(function (event) {
    event.preventDefault();

    var employeeData = {
      name: $("#name").val(),
      email: $("#email").val(),
      status: $("#status").val(),
    };

    var formAction = $(this).attr("action");
    var method = formAction.includes("/employees/") ? "PUT" : "POST";
    $.ajax({
      url: formAction || "/employees",
      type: method,
      data: employeeData,
      success: function (response) {
        if (method === "PUT") {
          // Update existing row
          var row = $(`tr[data-id="${response.id}"]`);
          row.find("td:nth-child(2)").text(response.name);
          row.find("td:nth-child(3)").text(response.email);
          row.find("td:nth-child(4)").text(response.status);
        } else {
          // Add new row to the table

          $("#employeeTable tbody").append(`
            <tr data-id="${response.id}">
              <td>${response.id}</td>
              <td>${response.name}</td>
              <td>${response.email}</td>
              <td>${response.status}</td>
              <td>
                <button class="btn btn-warning btn-sm on-edit" data-id="${response.id}">Edit</button>
                <button class="btn btn-danger btn-sm on-delete" data-id="${response.id}">Delete</button>
              </td>
            </tr>
          `);
        }
        $("#employeeForm")[0].reset();
        $("#employeeForm button").text("Add Employee");
      },
      error: function (xhr, status, error) {
        alert("Error: " + xhr.responseText);
      },
    });
  });
});
