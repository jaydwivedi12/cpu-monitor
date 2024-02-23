# CPU Monitor Project

## Overview

This project is a CPU monitor application designed to track and display CPU performance metrics. The project consists of a server and a client, utilizing MongoDB for data storage.

## Server Setup

1. Create a `.env` file in the `server` folder with the following content:

    ```
    PORT=8080
    DEV_MODE=development
    MONGODB_URL=mongodb+srv://<your-username>:<your-password>@your-mongodb-cluster/CPU-Monitor
    MONGO_PY=mongodb+srv://<your-username>:<your-password>@your-mongodb-cluster/
    ```

   Replace `<your-username>`, `<your-password>`, and `your-mongodb-cluster` with your MongoDB Atlas credentials and cluster information.

2. Install server dependencies:

    ```
    cd server
    npm install
    ```

3. Start the server:

    ```
    npm start
    ```

   The server will run on port 8080 in development mode.

## Client Setup

1. Navigate to the `client` folder.

2. Install client dependencies:

    ```
    cd client
    npm install
    ```

3. Start the client application:

    ```
    npm start
    ```

   This will launch the client on a development server.

Ensure MongoDB is properly configured and running for the server to connect to.
