# task_tracker_front_end
Coder Academy Class creating the front end of a task tracker app.

Notes as a front end dev:

- Look at the models, what are the fields it has? data types?
- Routes defined and what is the data expected to recieve in the request body? what is the type of format sent out?

Plan of attack:
- Design pages and layout
- Agree on API contract (levels of auth, tasks)
- Decide React architecture
- Start scaffolding UI

## 1. Pages and Layout

### 1.1 Global Layout

- Navbar
    - Shows app name/logo
    - Nav links:
        - Home (/)
        - Tasks (/tasks) - only useful when logged in
    - Auth area
        - When logged out: "Login" and "Register" links
        - When logged in: "Welcome, {email}" and a "Logout" button
        - If admin: show an "Admin" badge/label

- Main Content
    - Swaps between different pages using routing (React Router)
        <Outlet /> (render dynamic content)
    - Pages:
        - Home
        - Signup (/signup)
        - Login (/login)
        - Tasks list (/tasks) - auth
        - Task detail (/tasks/:id) - auth

- Footer
    - Simple text: App name, year and a link to GitHub repo

### 1.2 `/` - Home

- Heading: "Task Tracker"
- Subheading: Short description, "Kepp track of what you need to do."
- Buttons:
    - Get started - /register
    - If already logged in, "Go to my tasks" - /tasks

### 1.3 `/signup` - Sign Up

- UI:
    - Form field (check route auth to see what is expected):
        - Email (email)
        - Password (string)
        - Role ('user' | 'admin')
    - Button:
        - "Create account"
    - Link:
        - "Already have an account? Log in" - /login

- Behaviour:
    - On submit: call POST /api/v1/auth/signup on the backend
    - On success: show the success message, send them to /login

### 1.4 `/login` - Log In

- UI:
    - Form field:
        - Email (email)
        - Password (string)
    - Button:
        - "Log in"
    - Link:
        - "Need an account? Sign up" - /signup

- Behaviour:
    - On submit: call POST /api/v1/auth/login on the backend
    - On success:
        - Recieve a JWT token: {token}
        - Decode/store auth info
        - Redirect to /tasks
    - On failure:
        - Send error message (look at global error handler in index.js)
            - error message
            - error name

### 1.5 `/tasks` - Tasks list (auth)

- Layout:
    - Section: "Tasks"
        - Task cards, each card shows
            - Title
            - Status badge: ['todo (default)', 'in-progress', 'done']
            - Due Date (if provided)
            - User (if admin is viewing)
        Actions:
            - Click on task to see details
    
    - Filters:
        - Buttons or dropdown: "All", "To Do", "In Progress", "Done"
        - For admins: Filter by user

- Behaviour:
    - Protected route - only for auth users
    - On mount:
        - Call GET /api/v1/tasks
        - User: Only their tasks
        - Admin: Tasks from all users
    - On failure:
        - Send an error message
            - error message
            - error name
        - Redirect to /login

### 1.6 `/tasks/:id` - task detail (auth)

- Behaviour:
    - On mount:
        - call GET /api/v1/tasks/:taskId
    - Backend:
        - Admin: can view any task by id
        - User: can only view the tasks they have created; otherwise return 404
    - UI:
        - Show title, status, user(for admin), due date, timestamps
        - Later: Update/Delete buttons when backend supports it
    
    - On failure:
        - Send an error message
            - error message
            - error name
        - Redirect to /tasks or useNavigate(-1)

## Data Models (Frontend View)

- User
```
{
    id: string; // Mongo _id
    email: string;
    role: "user" | "admin";
    // password: NEVER sent back to frontend
}
```

- Tasks
```
{
    id: string; // _id
    user: string; // owner userId
    title: string;
    status: "todo" | "in_progress" | "done";
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}
```

## Permissions and Rules

- User
    - Create tasks
    - List their own tasks (GET /tasks)
    - View their own tasks (GET /tasks/:id)

- Admin
    - All of the above
    - List all tasks (GET /tasks)
    - View any task by id (GET /tasks/:id)

## API Contract (Request and Response Body Format)

- Auth Routes
    - POST /auth/signup
        - Body: { "email": string, "password": string, "role": "user" | "admin" }
        - Response (201): { "message": "User registered" }
    - POST /auth/login
        - Body: { "email": string, "password": string }
        - Response (200): { "token": string }
        - Token payload (decoded JWT): { "userId": string, "role": "user" | "admin", "iat": number, "exp": number }
    - Protected routes:
        - Require header:
            - Authorization: Bearer <token>

- Task Routes
    - GET /tasks
        - Auth: required.
        - Backend:
            - admin → all tasks.
            - user → tasks where user === userId from token.
        - Response:
            - Array of Task objects sorted by dueDate ascending.
    - POST /tasks
        - Auth: required.
        - Body: { "title": string, "status"?: string, "dueDate"?: string }
        - Response (201): { "message": "New Task added.", "body": Task }
    - GET /tasks/:id
        - Auth: required.
        - Response:
            - 200: Task object if user has access.
            - 404: { "error": "Task not found" } if not found or not owned.

## Frontend Architecture

- Routes and layout
    - Routes
        - "/"  - <App />
        - "/register" - <Register />
        - "/login" - <Login />
        - "/tasks" - <TasksPage /> (protected)
        - "/tasks/:id" - <TaskDetailPage /> (protected)

- Layout
    - AuthContext
        - AuthContext state:
        ```
        {
            userId: string | null;
            role: "user" | "admin" | null;
            token: string | null;
            isAuthenticated: boolean;
        }
        ```
    - Methods:
        - login(credentials):
        - Calls POST /auth/login.
        - Stores token and decoded { userId, role }
        - logout():
        - Clears token and auth state.

All protected API calls read token from AuthContext and send Authorization: Bearer <token>.

- Tasks state
    - Tasks state (initially local to pages):
        - tasks: Task[]
        - isLoading: boolean
        - error: string | null
        - filters: { status: string }
    - Methods:
        - loadTasks() → GET /tasks
        - createTask() → POST /tasks
        - Later: updateTaskStatus(), deleteTask() when backend routes exist.

## Start Building