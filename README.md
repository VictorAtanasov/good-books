# Good Books
Node.js RESTful API for books sharing. Still in development.

## All endpoints are:
* /auth/login | POST - Login
* /auth/register | POST - Register
* /user/:userId | GET - User information
* /user/:userId/books | GET - Books added by the user
  * /user/:userId/books/?page=1&limit=10 - Page and limit are optional url parameters. By default they are set to first page and limit 10
* /user/:userId/books/owned | POST - Add book owned by the user
* /user/:userId/books/owned | GET - Get book owned by the user 
  * /user/:userId/books/owned/?page=1&limit=10 - Page and limit are optional url parameters. By default they are set to first page and limit 10
* /books | GET - Get all books
  * /books/?page=1&limit=10 - Page and limit are optional url parameters. By default they are set to first page and limit 10
* /books | POST - Add book
* /books/:bookId | GET - Get book data
* /books/:bookId | PUT - Update book data
* /books/:bookId/rating | PUT - Rate book
* /books/:bookId/comments | POST - Post comment
* /books/search/:searchParameter/:searchParameter | GET - Search by author, title, category, etc.
  * /books/search/:searchParameter/:searchParameter/?page=1&limit=10 - Page and limit are optional url parameters. By default they are set to first page and limit 10

## More Complete information about the endpoints you can find in the following documentation.

# API Documentation

## Register User
* URL
  * **/auth/register**
* Method
  * **POST**
* Data Params
  * Requirments
    ```json
      {
        email: [string], [Required],
        password: [string], [Required], [minimum six characters, at least one letter, one number and one special character],
        username: [string], [Required], [at least 4 symbols],
        avatar: [file], [Not required], [jpeg/png and up to 1MB]
      }
    ```
  * Example 
    ```json
      {
        "email": "john.smith@gmail.com",
        "password": "1!gyd2",
        "username": "John",
      }
    ```
* Success Response
  * Status - 201
  * Response
  ```json
    {
      "success": true,
      "message": "Successful Registration",
    }
  ```
* Error Response
  * Status - 401
  * Response
  ```json
    {
        "success": false,
        "message": {
            "errors": {
                "email": "Please provide a valid email address",
                "password": "The password should be minimum six characters, at least one letter, one number and one special character"
            },
            "isFormValid": false,
            "message": "Check the form for errors"
        }
    }
  ```

## Login
* URL
  * **/auth/login**
* Method
  * **POST**
* Data Params
  * Requirments
    ```json
      {
        email: [string], [Required],
        password: [string], [Required],
      }
    ```
  * Example 
    ```json
      {
        "email": "john.smith@gmail.com",
        "password": "1!gyd2",
      }
    ```
* Success Response
  * Status - 201
  * Response
  ```json
      {
          "success": true,
          "message": "Successful login",
          "payload": {
              "email": "john.smith@gmail.com",
              "username": "John",
              "avatar": "287083f3f38c2881d96ccb1d760d4147ba40cc24.png",
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdDEuYmciLCJ1c2VySWQiOiI1YjMzN2VjNjRkNTM0YzJmYjQ5YWEyZGYiLCJpYXQiOjE1MzAxNzkyMDF9.jSexdQjjOs2f_BgQzxJ6dW_4tz2SbLSI67urcYxc32A",
              "userId": "5b337ec64d534c2fb49aa2df"
          }
      }
  ```
* Error Response
  * Status - 401
  * Response
  ```json
      {
          "success": false,
          "message": "Auth failed!"
      }
  ```

## User Data
* URL
  * **/user/:userId**
* Method
  * **GET**
* Data Params
  * Requirments - Authorization Header with value Bearer Token
* Success Response
  * Status - 200
  * Response
  ```json
    {
        "success": true,
        "payload": {
            "email": "john.smith@gmail.com",
            "username": "John",
            "avatar": "287083f3f38c2881d96ccb1d760d4147ba40cc24.png",
            "id": "5b337ec64d534c2fb49aa2df"
        }
    }
  ```
* Error Response
  * Status - 401
  * Response
  ```json
      {
          "success": false,
          "message": "Please provide a valid user id"
      }
  ```

## Books added by user
* URL
  * **/user/:userID/books**
  * **/user/:userID/books/?page=1&limit=10** - Page and limit are optional url parameters. By default they are set to first page and limit 10
* Method
  * **GET**
* Data Params
  * Requirments - Authorization Header with value Bearer Token
* Success Response
  * Status - 200
  * Response - if no books are added by that user the response is a json with success set to true and meesge that they are no books to show
  ```json
        {
            "success": true,
            "payload": [
                {
                    "_id": "5b337f114d534c2fb49aa2e0",
                    "title": "book title",
                    "author": "book author",
                    "description": "new lorem ipsum dolor sit amet",
                    "userId": "5b337ec64d534c2fb49aa2df",
                    "user": "John",
                    "category": "Crime",
                    "image": "default.jpg",
                    "rating": "4.50"
                }
            ]
        }
  ```
* Error Response
  * Status - 401
  * Response
  ```json
    {
      "success": false,
      "message": "Auth failed",
    }
  ```

## Add to book to owned by the user
* URL
  * **/user/:userId/books/owned**
* Method
  * **POST**
* Data Params
  * Requirments - Authorization Header with value Bearer Token and body with book id.
    ```json
        {
          "bookId": "5b337f114d534c2fb49aa2e0"
        }
    ```
* Success Response
  * Status - 201
  * Response
  ```json
      {
          "success": true,
          "payload": "Successfuly added!"
      }
  ```
* Error Response
  * Status - 401
  * Response
  ```json
    {
      "success": false,
      "message": "Auth failed",
    }
  ```

## Get books owned by the user
* URL
  * **/user/:userId/books/owned**
  * **/user/:userId/books/owned/?page=1&limit=20** - Page and limit are optional url parameters. By default they are set to first page and limit 10
* Method
  * **GET**
* Data Params
  * Requirments - Authorization Header with value Bearer Token and body with book id.
* Success Response
  * Status - 200
  * Response
  ```json
      {
          "success": true,
          "payload": [
              {
                "_id": "5b337f114d534c2fb49aa2e0",
                "title": "book title",
                "author": "book author",
                "description": "new lorem ipsum dolor sit amet",
                "userId": "5b337ec64d534c2fb49aa2df",
                "user": "John",
                "category": "Crime",
                "image": "default.jpg",
                "rating": "4.50"
              }
          ]
      }
  ```
* Error Response
  * Status - 401
  * Response
  ```json
    {
      "success": false,
      "message": "Auth failed",
    }
  ```