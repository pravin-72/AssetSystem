# ASSET-MANAGEMENT-SYSTEM

The **Employee Master** module facilitates the management of employee information. It provides capabilities to add, edit, and view employee records with search and filtering options to distinguish between active and inactive employees. A structured user interface (UI) supports these functionalities through forms and data tables integrated with features like DataTables.net for advanced filtering and searching.

The **Asset Master** module focuses on managing assets by enabling the addition, editing, and viewing of detailed asset records, such as type, make, model, serial number, and unique IDs. It includes filters for asset type, make, and model, alongside a robust API layer to support CRUD operations.

The **Asset Category Master** streamlines categorization by managing asset groups like laptops, mobile phones, and other equipment. This module ensures categories are available as dropdown options in relevant forms and provides a dedicated UI for category CRUD operations.

The **Stock View** module provides a branch-wise overview of assets currently in stock. It displays stock totals, categorized by branch and includes a comprehensive view of the total asset value, ensuring inventory insights.

The **Issue Asset and Return Asset** modules manage the asset issuance and return processes. They update asset statuses, maintain detailed logs for audit purposes, and ensure accountability through forms and APIs that capture necessary details like employee and asset information and the reasons for return.

The **Scrap Asset** module addresses the end-of-life phase of assets by marking them as obsolete. This excludes the assets from active views while keeping them accessible for reports. Additionally, it captures comments for documentation.

Finally, the Asset History module provides a complete lifecycle overview of each asset, from acquisition to scrapping. The history is displayed in an intuitive timeline or table format, supported by APIs that fetch historical data for transparency and traceability.


### 1. Prerequisites  
Before you start, ensure you have the following tools installed on your machine:  
- Node.js (for the backend server and frontend dependencies).  
- npm (comes with Node.js).  
- A database ( PostgreSQL).  
- Git (to clone the repository).  
- A code editor, such as Visual Studio Code.

### 2. Clone the Repository  
Open your terminal and run:  
bash
git clone <repository-url>

Replace <repository-url> with the GitHub URL of the project.

### 3. Navigate to the Project Directory  
bash
cd <project-folder>

### 4. Backend Setup  
#### Install Dependencies:  
Navigate to the backend folder:  
cd backend

#### Configure Environment Variables:  
- Create a .env file in the backend folder.  
- Add the following environment variables:  
  plaintext
  DB_HOST=<database-host>
  DB_PORT=<database-port>
  DB_USER=<database-username>
  DB_PASSWORD=<database-password>
  DB_NAME=<database-name>
  PORT=<server-port>
  
#### Start the Backend Server:  
bash
npm start

### 5. Frontend Setup  
#### Install Dependencies:  
Navigate to the frontend folder:  
bash
cd ../frontend

### 6. Database Setup  
- Create a new database in your preferred database system.  
- Import the provided database schema or run the initialization scripts included in the project folder.  
- Ensure the database credentials in the .env file match the database you’ve set up.

### 7. Access the Application  
Once both servers (backend and frontend) are running:  
- Open your web browser.  
- Navigate to http://localhost:<frontend-port> (e.g., http://localhost:3000).

### 8. Testing the Application  
- Log in or register if authentication is enabled.  
- Explore modules such as Employee Master, Asset Master, and Stock View.  
- Test CRUD operations, filters, and other features.

By following these steps, you’ll have the Asset Management System up and running on your local machine or server.

If your project is using Pug (for server-side templating) and Hstore (for handling key-value pairs in SQL databases like PostgreSQL), you’ll need the following additional dependencies:


### Dependencies for Pug and Hstore

**1. Pug** 
Pug is a template engine that simplifies creating HTML pages with a cleaner syntax.  

Install Pug for your project:  
npm install pug

**2. Hstore**
Hstore is a PostgreSQL data type for storing key-value pairs. You’ll typically use it with Sequelize for managing your database schema.

Install Hstore and related dependencies:  
npm install sequelize pg pg-hstore

**Complete Installation Command**
For a project using both Pug and Hstore, run:  
npm install pug sequelize pg pg-hstore


**Usage Overview**
- Pug will handle the server-rendered views for pages like forms, dashboards, etc.  
- Hstore will manage key-value pair data for assets or other entities that require dynamic or nested properties.

**PROJECT EXPLANATION**
LINK--(https://drive.google.com/file/d/1Pad9DWV6Qin2nrpoRezkhOEgfckHomIY/view?usp=drive_link)
