# 🔗 Short-URL

A backend service that allows users to convert long URLs into short, easily shareable links. Along with shortening, the service provides tracking features that let users monitor the number of visits, the countries of origin, and the devices used by visitors.

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

## 🧪 Getting Started

1. **Clone the repository:**

   git clone https://github.com/Basu008/Short-URL.git
   cd Short-URL

2. **Installing dependency:**
    npm install

3. **Setting up config file:**
    - Go to conf folder in root directory
    - create a new file as default.toml
    - refer to example.toml and add configuration as per your need.

4. **Running Code:**
    - **For dev environment:** npm run dev
    - **For production environment:** npm start

