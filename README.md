# Video Hosting Platform - Backend

[Model link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj?origin=share)


## Overview

This project is a robust and scalable backend for a video hosting platform, designed to function similarly to YouTube. It is built using Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Tokens), bcrypt, and other modern technologies. The backend provides all the core functionalities necessary for a video hosting service, including user authentication, video upload and management, user interactions (likes, dislikes, comments, subscriptions), and much more.

This platform serves as a foundation for a full-stack application where users can upload, watch, and interact with videos while having an account to manage their preferences, subscriptions, and content.

## Key Features

- **User Authentication**:
  - **Login / Signup**: Users can create accounts and securely log in to the platform.
  - **JWT Authentication**: JSON Web Tokens (JWT) are used for secure user authentication, with separate access tokens and refresh tokens for session management.
  - **Password Hashing**: User passwords are securely hashed using bcrypt to ensure data protection.

- **Video Management**:
  - **Video Upload**: Users can upload video files, with metadata such as title, description, and tags.
  - **Video Metadata**: Store essential video information (e.g., title, description, upload date, etc.) in MongoDB for easy retrieval.

- **User Interactions**:
  - **Likes / Dislikes**: Users can like or dislike videos, which influences the video’s visibility and ranking.
  - **Comments & Replies**: Users can comment on videos and reply to other users’ comments to foster engagement.
  - **Subscribe / Unsubscribe**: Users can subscribe to channels to receive notifications about new content and unsubscribe as needed.

- **Advanced Features**:
  - **JWT Tokens**: Access tokens for authenticated API requests, and refresh tokens for extending user sessions securely.
  - **Authorization Middleware**: Ensures that only authenticated and authorized users can perform specific actions like uploading videos or interacting with content.

## Technologies Used

- **Node.js**: JavaScript runtime for building fast and scalable server-side applications.
- **Express.js**: Web application framework for Node.js, making routing and server management easier.
- **MongoDB**: NoSQL database for storing user data, video metadata, comments, etc.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js, providing a schema-based solution to interact with MongoDB.
- **JWT (JSON Web Tokens)**: Secure way to authenticate users and manage session tokens for API access.
- **bcrypt**: Library for hashing passwords securely before storing them in the database.
- **multer**: Middleware for handling file uploads (in this case, video files).

## API Endpoints

The backend exposes a set of RESTful APIs to handle user and video interactions. Below are some of the key endpoints:

### Authentication
- `POST /api/auth/signup`: Register a new user.
- `POST /api/auth/login`: Login and obtain an access token.
- `POST /api/auth/refresh-token`: Refresh the JWT access token.

### Users
- `GET /api/users/profile`: Get user profile data.
- `PUT /api/users/profile`: Update user profile information.

### Videos
- `POST /api/videos/upload`: Upload a new video.
- `GET /api/videos`: Get a list of all videos.
- `GET /api/videos/:id`: Get details of a specific video.
- `PUT /api/videos/:id`: Update video metadata (e.g., title, description).
- `DELETE /api/videos/:id`: Delete a video.

### Interactions
- `POST /api/videos/:id/like`: Like a video.
- `POST /api/videos/:id/dislike`: Dislike a video.
- `POST /api/videos/:id/comment`: Post a comment on a video.
- `POST /api/comments/:id/reply`: Reply to a comment on a video.
- `POST /api/channels/:id/subscribe`: Subscribe to a channel.
- `POST /api/channels/:id/unsubscribe`: Unsubscribe from a channel.


## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- MongoDB instance (local or hosted)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/18-sumit/Backend.git
     cd Backend
     npm install
     npm start


# Environment Setup for Video Hosting Platform - Backend

This project requires some environment variables to be configured in order to run the backend services correctly. Please follow the instructions below to set up the environment for your development or production environment.

## Environment Variables

### 1. Create `.env` File

To configure the backend, you need to create a `.env` file in the root directory of your project. This file will store all the sensitive information and configuration details.

Below are the required environment variables:

### 2. Required Variables

| **Variable Name**                | **Description**                                                                          |
|-----------------------------------|------------------------------------------------------------------------------------------|
| `PORT`                            | The port number the server will run on (e.g., `8000`).                                  |
| `MONGODB_URI`                     | Your MongoDB connection string (make sure to replace `YOUR-PASSWORD` with your actual password). |
| `CORS_ORIGIN`                     | The allowed origin for CORS requests. Use `*` for all domains or specify the domain.    |
| `ACCESS_TOKEN_SECRET`             | A secret key used to sign JWT access tokens.                                             |
| `ACCESS_TOKEN_EXPIRY`             | Expiry time for access tokens (e.g., `1d` for 1 day).                                   |
| `REFRESH_TOKEN_SECRET`            | A secret key used to sign JWT refresh tokens.                                            |
| `REFRESH_TOKEN_EXPIRY`            | Expiry time for refresh tokens (e.g., `10d` for 10 days).                               |
| `CLOUDINARY_CLOUD_NAME`           | The cloud name for your Cloudinary account (used for video/image storage).               |
| `CLOUDINARY_API_KEY`              | Your Cloudinary API key.                                                                 |
| `CLOUDINARY_API_SECRET`           | Your Cloudinary API secret.                                                              |

### 3. Example `.env` File

```plaintext
PORT=8000
MONGODB_URI=mongodb+srv://sumitsingh3076:YOUR-PASSWORD@cluster0.zgaef.mongodb.net
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=YOUR_REFRESH_TOKEN
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```




### Steps to Use:
1. **Create a `.env` file** in the root directory of your project.
2. **Copy-paste** the above example configuration into your `.env` file.
3. Replace the placeholders (`YOUR-PASSWORD`, `YOUR_ACCESS_TOKEN`, `YOUR_REFRESH_TOKEN`, etc.) with the correct values.
4. Install dependencies and start the server as described in the README.

This setup will ensure your backend runs with the appropriate environment variables configured. If you have any further questions or need modifications, feel free to ask!


    


