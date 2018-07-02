# Good Books
* Node.js RESTful API for books sharing.
* Still in development.
* URL - https://good-books-rdfwwrecig.now.sh 

## All endpoints are:
* /auth/login | POST - Login
* /auth/register | POST - Register
* /user/:userId | GET - User information
* /user/:userId | PUT - Update user information
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
* /books/search/:searchParameter/:searchParameter | GET - Get all authors or categories.
  * /books/search/:searchParameter/:searchParameter/?page=1&limit=10 - Page and limit are optional url parameters. By default they are set to first page and limit 10
* /books/search/:searchParameter | GET - Get all book by author name or category name.
  * /books/search/:searchParameter/?page=1&limit=10 - Page and limit are optional url parameters. By default they are set to first page and limit 10

## More Complete information about the endpoints you can find in the following documentation.

# API Documentation

## Register User
* URL
  * **/auth/register**
* Method
  * **POST**
* Data Params
  * Request body:
    ```json
      {
        email (string): Required,
        password (string): Required, minimum six characters, at least one letter, one number and one special character,
        username (string): Required, at least 4 symbols,
        avatar (file): Optional, jpeg/png and up to 1MB
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
  * Request body:
    ```json
      {
        email (string): Required,
        password (string): Required,
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

## Update User
* URL
  * **/user/:userId**
* Method
  * **PUT**
* Data Params
  * Headers - Authorization: Bearer Token
  * Request body:
    ```json
      {
        email (string): Required,
        password (string): Required, minimum six characters, at least one letter, one number and one special character,
        newPassword (string): Optional, minimum six characters, at least one letter, one number and one special character,
        username (string): Optional, at least 4 symbols,
        avatar (file): Optional, jpeg/png and up to 1MB
      }
    ```
  * Example 
    ```json
      {
        "email": "john.smith@gmail.com",
        "password": "1!gyd2",
        "newPassword": "2?lop4",
        "username": "John Smith",
      }
    ```
* Success Response
  * Status - 201
  * Response
  ```json
    {
      "success": true,
      "message": "User data is updated!",
    }
  ```
* Error Response
  * Status - 400
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


## Get User Data
* URL
  * **/user/:userId**
* Method
  * **GET**
* Data Params
  * Headers - Authorization: Bearer Token
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
  * Headers - Authorization: Bearer Token
* Success Response
  * Status - 200
  * Response - if no books are added by that user the response is a json with success set to true and message - "No books to show"
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

## Add book to owned by the user
* URL
  * **/user/:userId/books/owned**
* Method
  * **POST**
* Data Params
  * Headers - Authorization: Bearer Token
  * Request body:
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

## Get all books owned by user id
* URL
  * **/user/:userId/books/owned**
  * **/user/:userId/books/owned/?page=1&limit=20** - Page and limit are optional url parameters. By default they are set to first page and limit 10
* Method
  * **GET**
* Data Params
  * Headers - Authorization: Bearer Token
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


## Get all books
* URL
  * **/books**
  * **/books/?page=1&limit=20** - Page and limit are optional url parameters. By default they are set to first page and limit 10
* Method
  * **GET**
* Success Response
  * Status - 200
  * Response
  ```json
        {
            "success": true,
            "booksCount": 1,
            "payload": [
                {
                    "_id": "5b39c6df07d6e5121cde2552",
                    "title": "Guards Guards",
                    "author": "terry Pratchett",
                    "description": "lorem ipsum dolor sit amet",
                    "userId": "5b337ec64d534c2fb49aa2df",
                    "user": "John",
                    "category": "Fiction",
                    "image": "287083f3f38c2881d96ccb1d760d4147ba40cc24.jpg",
                    "rating": 4.5,
                    "totalRating": 9,
                    "ratingsCount": 2
                }
            ]
        }
  ```
* Error Response
  * Status - 400
  * Response
  ```json
    {
      "success": false,
      "message": "No books found",
    }
  ```

## Post book
* URL
  * **/books**
* Method
  * **POST**
* Data Params
  * Headers - Authorization: Bearer Token
  * Request body: 
  ```json
      {
        title (string): Required,
        author (string): Required,
        description (string): Required,
        userId (number): Required, id of the user adding the book,
        user (string): Required, username of the user adding the book,
        category (string): Required,
        image (file): Optional,
      }
  ```
  * Example:
      ```json
        {
          "title": "Guards Guards",
          "author": "Terry Pratchett",
          "description": "lorem ipsum dolor sit amet",
          "userId": "5b337ec64d534c2fb49aa2df",
          "user": "viki",
          "category": "Fiction"
        }
      ```
* Success Response
  * Status - 201
  * Response
  ```json
        {
            "success": true,
            "message": "The book is successfuly added!",
            "payload": {
                "insertedId": "5b39c6df07d6e5121cde2552"
            }
        }
  ```
* Error Response
  * Status - 400
  * Response
  ```json
      {
          "success": false,
          "message": "Error message"
        }
  ```

## Get book by id
* URL
  * **/books/:bookId**
* Method
  * **GET**
* Success Response
  * Status - 200
  * Response
  ```json
      {
          "success": true,
          "payload": [
              {
                  "_id": "5b39c6df07d6e5121cde2552",
                  "title": "Guards Guards",
                  "author": "terry Pratchett",
                  "description": "lorem ipsum dolor sit amet",
                  "userId": "5b337ec64d534c2fb49aa2df",
                  "user": "viki",
                  "category": "Fiction",
                  "image": "default.jpg",
                  "rating": 4.5,
                  "totalRating": 9,
                  "ratingsCount": 2
              }
          ]
      }
  ```
* Error Response
  * Status - 200
  * Response
  ```json
      {
        "success": false,
        "message": "Nothing is found"
      }
  ```


## Update book
* URL
  * **/books/:bookId**
* Method
  * **PUT**
* Data Params
  * Headers - Authorization: Bearer Token
  * Request body:
    ```json
        {
          title (string): Optional,
          author (string): Optional,
          description (string): Optional,
          category (string): Optional,
          image (file): Optional
        }
    ```
  * Example:
    ```json
      {
        "title": "Guards Guards",
        "author": "Terry Pratchett",
        "description": "lorem ipsum dolor sit amet",
        "category": "Fiction"
      }
    ```
* Success Response
  * Status - 201
  * Response
  ```json
     {
        success: true,
        message: 'The book is successfully updated!',
      }
  ```
* Error Response
  * Status - 400
  * Response
  ```json
    {
        success: false,
        message: 'There was nothing to update',
      }
  ```

## Add rating
* URL
  * **/books/:bookId/rating**
* Method
  * **PUT**
* Data Params
  * Headers - Authorization: Bearer Token
  * Request body:
    ```json
        {
          rating (number): Requires, the rating must be in range 1 - 5
        }
    ```
* Success Response
  * Status - 201
  * Response
  ```json
      {
        "success": true,
        "message": "The rating is successfully added"
      }
  ```
* Error Response
  * Status - 400
  * Response
  ```json
    {
      success: false,
      message: "Error message",
    }
  ```

## Add comment
* URL
  * **/books/:bookId/comments**
* Method
  * **POST**
* Data Params
  * Headers - Authorization: Bearer Token
  * Request body:
    ```json
        {
          username (string): Required, username of the user adding the comment,
          userId (string): Required, id of the user adding the comment,
          avatar (string): Required, avatar of the user adding the comment,
          title (string): Required, title of the cooment,
          comment (string): Required, comment text,
        }
    ```
  * Example: 
    ```json
        {
          "username": "viki",
          "userId": "5b337ec64d534c2fb49aa2df",
          "avatar": "287083f3f38c2881d96ccb1d760d4147ba40cc24.png",
          "title": "comment title",
          "comment": "comment text"
        }
    ```
* Success Response
  * Status - 201
  * Response
  ```json
      {
        "success": true,
        "payload": {
            "bookId": "5b35e24321533d252cfe3139",
            "comment": "comment text",
            "title": "comment title",
            "commenter": {
                "username": "viki",
                "userId": "5b337ec64d534c2fb49aa2df",
                "avatar": "287083f3f38c2881d96ccb1d760d4147ba40cc24.png"
            },
            "_id": "5b39e2cd4c44671c3ca6ef54"
        }
      }
  ```
* Error Response
  * Status - 400
  * Response
  ```json
      {
        success: false,
        message: "Error message",
      }
  ```

## Get comments for book
* URL
  * **/books/:bookId/comments**
* Method
  * **GET**
* Data Params
* Success Response
  * Status - 200
  * Response
  ```json
      {
        "success": true,
        "payload": [
            {
                "_id": "5b39c70907d6e5121cde2554",
                "bookId": "5b39c6df07d6e5121cde2552",
                "comment": "comment text",
                "title": "comment title",
                "commenter": {
                    "username": "viki",
                    "userId": "5b337ec64d534c2fb49aa2df",
                    "avatar": "287083f3f38c2881d96ccb1d760d4147ba40cc24.png"
                }
            }
        ]
      }
  ```
* Error Response
  * Status - 200
  * Response
  ```json
      {
        "success": false,
        "message": "This book don't have any comments!"
      }
  ```

## Get all categories or all authors
* URL
  * **/books/search/:category-name**
  * **/books/search/:author-name**
  * **/books/search/:category-name/?page=1&limit=10** - Page and limit are optional url parameters. By default they are set to first page and limit 10
* Method
  * **GET**
* Success Response
  * Status - 200
  * Response
  ```json
      {
        "success": true,
        "payload": [
            {
                "_id": "5b35f65dd504bf2c7c93b005",
                "name": "Crime"
            },
            {
                "_id": "5b35fbb6e793b213988afb01",
                "name": "Fiction"
            }
        ]
      }
  ```
* Error Response
  * Status - 
  * Response
  ```json
    {
      "success": false,
      "message": "No data found"
    }
  ```

## Get all books by author name or category name
* URL
  * **/books/search/category/fiction**
  * **/books/search/author/terry-pratchett**
  * **/books/search/category/fiction/?page=1&limit=10** - Page and limit are optional url parameters. By default they are set to first page and limit 10
* Method
  * **GET**
* Success Response
  * Status - 200
  * Response
  ```json
    {
      "success": true,
      "payload": [
          {
              "_id": "5b39c6df07d6e5121cde2552",
              "title": "Guards Guards",
              "author": "terry pratchett",
              "description": "lorem ipsum dolor sit amet",
              "userId": "5b337ec64d534c2fb49aa2df",
              "user": "viki",
              "category": "Fiction",
              "image": "default.jpg",
              "rating": 4.5,
              "totalRating": 9,
              "ratingsCount": 2
          }
      ]
    }
  ```
* Error Response
  * Status - 400
  * Response
  ```json
    {
      "success": false,
      "message": "Nothing is found! Check your search parameters"
    }
  ```
