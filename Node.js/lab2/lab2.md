# Lab 2: Building a Posts API

## Objective

In this lab, you'll extend your Node.js server by creating a new router and controller dedicated to the "Posts" resource. You'll implement typical CRUD operations (Create, Read, Update, Delete) and integrate them into your existing application.

## Assignment Overview

Your task is to build endpoints for the Posts resource in your Node.js Express server. Complete the following steps:

1. **Create a New Router for Posts**
   - Create a router file (e.g. `posts.js` in a dedicated `routes` directory).
   - Use Express Router to define the routes associated with the posts resource.
2. **Create a Posts Controller**

   - Create a controller file (e.g. `postsController.js` in a `controllers` directory).
   - Implement functions to handle CRUD operations:
     - **createPost**: Create a new post
     - **getPosts**: Return a list of all posts
     - **getPostById**: Retrieve a single post by its ID
     - **updatePostId**: Update an existing post
     - **deletePostId**: Remove a post

3. **Set Up Endpoints**

   - Define the following endpoints using your new router:
     - `GET /posts` – Retrieve a list of posts.
     - `GET /posts/:id` – Retrieve a specific post by its ID.
     - `POST /posts` – Create a new post.
     - `PUT /posts/:id` – Update an existing post.
     - `DELETE /posts/:id` – Delete a post.
   - Ensure that the controller's methods are used to handle these routes.

4. **Integrate Your Router into the Main Application**
   - Import and use your new posts router in the main server file (e.g. `server.js` or `app.js`).
   - Verify that the endpoints are correctly hooked into the server.

## Guidelines

- **Modular Structure:**  
  Maintain a clear separation of concerns by ensuring routing logic (in the router) and business logic (in the controller) are kept separate.

- **HTTP Standards:**  
  Use appropriate HTTP status codes for successful responses as well as errors (e.g. 200 OK, 201 Created, 404 Not Found, 400 Bad Request, etc.).

- **Data Storage:**  
  store the data in a json file like what we did with the users today

- **Error Handling:**  
  Include error handling logic to return friendly error messages and proper HTTP status codes in case of invalid requests or server errors, throw errors with status codes and to handel them in the global error middleware.
- **Testing:**  
  Use a tool such as Postman.

## Bonus Challenge

- **Input Validation:**
  Implement middleware to validate incoming data for creating or updating posts.
  hint: use one of these (joi,zod,express-validator) or any other package that handels input validation
  hint: validate(createPostSchema)

- **Extra Features:**  
  If time permits, consider adding pagination to the GET endpoint or search functionality based on the post title/content.

- **API Error Class**
search for api error class pattern in express.js and throw client errors using it 

Good luck and happy coding!
