# 🔗 Short-URL

A simple and efficient URL shortener service built in **Node.JS**. This service takes a long URL and generates a shorter, more manageable version using unique short codes, similar to services like bit.ly or tinyurl.

## ✨ Features

- Generate short URLs for long URLs
- Redirect to original long URLs from short codes
- Track total number of visits per short URL, storing location and device type of visitor
- Switch between user plans to add a premium feel
- Using stateless authentication using JWT
- RESTful API design using Express
- MongoDB integration for persistent storage
- Clean and minimal code structure

## 🛠 Tech Stack

- **Language:** Node.JS
- **Database:** MongoDB
- **Routing:** Express
- **UUID:** For generating unique short IDs

## 📦 How the code works?

1. **Clone the repository:**

   git clone https://github.com/Basu008/Short-URL.git
   cd Short-URL

2. **Setting up config file:**
    - Go to conf folder in root directory
    - create a new file as default.toml
    - refer to example.toml and add configuration as per your need.

3. **Running Code:**
    - **For dev environment:** npm run dev
    - **For production environment:** npm start

