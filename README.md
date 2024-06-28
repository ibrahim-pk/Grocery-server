# 🛒 MERN Grocery Shop Project

Welcome to the MERN Grocery Shop server Project! This project is built using the MERN (MongoDB, Express, Node.js) stack and incorporates various features like user authentication, product listings, reviews, and more.


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ibrahim-pk/Grocery-server.git
   ```

2. Change into the project directory:

   ```bash
   cd Grocery-server
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```


## Configuration

1. Create a `.env` file in the `root` directory with the following environment variables:

   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET_KEY = jwt_secret_key
   JWT_RESET_PASSWORD_SECRET_KEY = jwt_reset_password_secret_key
   COOKIE_EXPIRE = 5
   SMPT_MAIL = smpt_mail
   SMPT_PASSWORD = smpt_password
   CLOUD_NAME = your_cloudinary_cloud_name
   CLOUD_API_KEY =  your_cloudinary_api_key
   CLOUD_API_SECRET_KEY =  your_cloudinary_api_secret
   ```

## Usage

1. Start the backend:

   ```bash
   npm run dev
   ```



3. Access the application in your web browser at `http://localhost:8000`.

## Technologies

- 📦 **MongoDB**: A NoSQL database for storing data.
- ⚙️ **Express.js**: A web application framework for Node.js.
- ⚛️ **React**: A JavaScript library for building user interfaces.
- 🚀 **Node.js**: A JavaScript runtime for server-side development.
- 🔑 **JWT**: JSON Web Tokens for user authentication.
- 🔒 **bcrypt**: A library for hashing user passwords.
- 💌 **Nodemailer**: A library for sending email.
- ☁️ **Cloudinary**: A cloud-based image and video management service.

Happy coding! 👩‍💻👨‍💻
