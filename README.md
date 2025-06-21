# WTWR (What to Wear?): Back End

This is the back-end server for the WTWR application. A weather-based clothing recommendation app. The server provides a RESTful API that manages users and clothing items, allowing users to create profiles, add clothing items with weather categories, and like/unlike items.

# Technologies and Techniques

Technologies Used:
Backend Framework:

- Node.js - JavaScript runtime environment
- Express.js v4.21.2 - Web application framework for building the REST API

Database:

- MongoDB - NoSQL document database for data storage
- Mongoose - Object Document Mapper (ODM) for MongoDB integration

Development Tools:

- ESLint v8 - Code linting and style enforcement
- Airbnb JavaScript Style Guide - Code style standards
- Prettier - Code formatting (if integrated)
- Nodemon - Hot reload for development
- EditorConfig - Consistent coding styles across editors

Programming Techniques:
API Design:

- RESTful API architecture - Following REST principles for endpoints
- Express routing - Organized route handling with separate router files
- MVC pattern - Models, Controllers, and Routes separation

Database Management:

- Schema design with Mongoose
- Data validation using Mongoose validators
- Database connection management

Error Handling:

- Centralized error handling middleware
- HTTP status codes for proper API responses
- Input validation and sanitization

Code Organization:

- Modular architecture - Separate folders for routes, controllers, models, utils
- Environment configuration - Using process.env for port settings

### Testing

Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
