# Jewellery Management ERP System

## Table of Contents
- [Project Goal](#project-goal)
- [Scope of the Project](#scope-of-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Learnings](#learnings)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Goal
The goal of this project is to develop a comprehensive ERP system tailored for jewellery shops. The system enables shop owners to manage their products, create invoices, track inventory, and maintain purchase history efficiently. This tool aims to automate and streamline the business processes, reducing manual work and enhancing productivity.

## Scope of the Project
The Jewellery Management ERP System covers the following aspects:
- Product management: Adding, editing, and deleting products.
- Invoice generation: Creating and managing customer invoices.
- Inventory tracking: Monitoring stock levels and inventory movements.
- Purchase history: Recording and viewing purchase transactions.
- User management: Role-based access control for different users.

## Features
- **Product Management:** 
  - Add new products with details such as name, category, price, and quantity.
  - Edit or delete existing products.
  - View all products in a list or grid format.

- **Invoice Management:** 
  - Generate invoices for customer purchases.
  - Print or email invoices directly from the system.
  - Track paid and unpaid invoices.

- **Inventory Tracking:** 
  - Real-time updates on inventory levels.
  - Alerts for low stock levels.
  - Detailed inventory reports.

- **Purchase History:** 
  - Record all purchase transactions.
  - View detailed purchase history with dates and amounts.
  - Filter and search through purchase records.

- **User Management:** 
  - Admin and user roles with different access permissions.
  - Secure login and authentication system.

## Technologies Used
- **Frontend:** ReactJS
- **Backend:** Django
- **Database:** PostgreSQL
- **Hosting:** AWS
- **Other:** AWS RDS for database hosting

## Learnings
Through the development of this ERP system, I gained valuable insights and hands-on experience in:
- Integrating frontend (ReactJS) with backend (Django).
- Designing and implementing RESTful APIs.
- Managing and querying a PostgreSQL database.
- Deploying applications on AWS and using AWS RDS for database management.
- Implementing role-based access control and authentication.
- Enhancing UI/UX for better user experience.

## Installation
To run this project locally, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/jewellery-management-erp.git
    cd jewellery-management-erp
    ```

2. **Backend Setup:**
    - Create a virtual environment and activate it:
      ```bash
      python -m venv venv
      source venv/bin/activate  # On Windows use `venv\Scripts\activate`
      ```
    - Install backend dependencies:
      ```bash
      pip install -r requirements.txt
      ```
    - Apply migrations:
      ```bash
      python manage.py migrate
      ```
    - Start the backend server:
      ```bash
      python manage.py runserver
      ```

3. **Frontend Setup:**
    - Navigate to the frontend directory:
      ```bash
      cd frontend
      ```
    - Install frontend dependencies:
      ```bash
      npm install
      ```
    - Start the frontend server:
      ```bash
      npm start
      ```

## Usage
- Visit `http://localhost:8000` to access the backend API.
- Visit `http://localhost:3000` to use the frontend interface.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License
This project is licensed under the MIT License.
