# Product Filter API

This is a Node.js REST API for fetching, filtering, and uploading products based on a provided CSV data file. It uses MongoDB for data storage and provides extensive filtering and search capabilities.

## Features

- Fetch all products
- Filter products by various criteria (category, price range, availability, condition, brand)
- Full-text search functionality
- Sorting and pagination
- CSV file upload to populate the database
- MVC architecture with services layer
- Class-based controllers
- Validation using Joi
- Error handling middleware
- Test cases using Jest and Supertest

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory and add your MongoDB connection string: