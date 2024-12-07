# API Documentation

- [User Management](#user-management)

## User Management

This API allows for CRUD operations on the users collection. Each user document contains the following fields:

- `userId` (string): Unique identifier for each user.
- `userName` (string): Name of the user.
- `email` (string): Email of the User.
- `password` (string): password of the user.
- `confirmPassword` (string): confirmPassword of the user.

### Base URL : `/`

### Authentication


### Endpoints

- [signup](#1-sign-up)
- [signin](#-sign-in)
- [Get User By ID](#2-get-user-by-id)
- [Update User By ID](#3-update-user-by-id)
- [Delete User By ID](#4-delete-user-by-id)
- [Get All Users](#5-get-all-users)

### 1. Create User

- URL : `/signup`
- Method : `POST`
- Request Body :

```json
{
  "userName": "string", // required, name of the user
  "email": "string", //required, email of the user
  "password": "string", //required, password of the user
}
```

- Response :

  - **201 Created**: signup successfull.

  ```json
  {
    "message": "signup successfull"
  }
  ```

  - **400 Bad Request**: Missing required fields (userName, email, password, confirmPassword).

  ```json
  {
    "error": "Empty input fields!"
  }
  ```

  - **400 Bad Request**: input fileds userName must contain string a-z or A-Z.

  ```json
  {
    "error": "Invalid userName entered"
  }
  ```
  - **400 Bad Request**: input fileds email must contain a valid email.

  ```json
  {
    "error": "Invalid email entered"
  }
  - **400 Bad Request**: input fileds email must match the password.

  ```json
  {
    "error": "Password confirmation mismatch"
  }
  - **400 Bad Request**: input fileds password must be at least 8 characters.

  ```json
  {
    "error": "Password must be at least 8 characters!"
  }
  ```
  - **400 Bad Request**: email has been registered previously.

  ```json
  {
    "error": "User with the provided email already exists"
  }
  ```

  - **500 Internal Server Error**: Error occurred while checking or saving user.

  ### 1. sign In user

- URL : `/signin`
- Method : `POST`
- Request Body :

```json
{
  "email": "string", //required, email of the user
  "password": "string", //required, password of the user
}
```

- Response :

  - **200 Ok**: signin successfull.

  ```json
  {
    "message": "signin successfull"
  }
  ```

  - **400 Bad Request**: Missing required fields (email, password).

  ```json
  {
    "error": "Empty credentials supplied"
  }
  ```

  - **404 Not Found**: the email entered does not exist .

  ```json
  {
    "error": "User Not Found"
  }
  ```
  - **400 Bad Request**: Invalid password entered.

  ```json
  {
    "error": "Invalid passowrd entered"
  }
  ```

  - **500 Internal Server Error**: Error occurred while checking or saving user.

### 2. Get User by ID

- URL : `/users/:id`
- Method : `GET`
- Parameters : `userId` (string): Unique identifier of the user to retrieve.
- Response :

  - **200 OK**: Returns the user data.

  ```json
  {
    "userName": "string",
    "email": "string",
    "password": "string" (password that has been encrypted)
  }
  ```

  - **404 Not Found**: User not found.

  ```json
  {
    "error": "User not found"
  }
  ```

  - **500 Internal Server Error**: An error occurred while fetching user data.

### 3. Update User by ID

- URL : `/users/:userId`
- Method : `PUT`
- Parameters : `id` (string): Unique identifier of the user to update.
- Request Body :

```json
{
  "userName": "string", // optional, name of the user
  "email": "string", // optional, email of the user
  "password": "string" // optional, password of the user
}
```

- Response :

  - **200 OK**: User updated successfully.

  ```json
  {
    "message": "User updated successfully"
  }
  ```

  - **404 Not Found**: User not found.

  ```json
  {
    "error": "User not found"
  }
  ```

  - **500 Internal Server Error**: An error occurred while updating the user.

### 4. Delete User by ID

- URL : `/users/:id`
- Method : `DELETE`
- Parameters : `userId` (string): Unique identifier of the user to delete.
- Response :

  - **200 OK**: User updated successfully.

  ```json
  {
    "message": "User deleted successfully"
  }
  ```

  - **404 Not Found**: User not found.

  ```json
  {
    "error": "User not found"
  }
  ```

  - **500 Internal Server Error**: An error occurred while deleting the user.

### 5. Get All Users

- URL : `/users`
- Method : `GET`
- Response :

  - **200 OK**: Returns an array of user objects.

  ```json
  [
    {
      "id": "string",          // userId from Firestore document ID
      "userName": "string",
      "email": "string",
      "passeord": "string"
    },
    {
      "id": "string",          // userId from Firestore document ID
      "userName": "string",
      "email": "string",
      "passeord": "string"
    },
    ...
  ]
  ```

  - **500 Internal Server Error**: An error occurred while fetching the users.
