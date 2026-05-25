# CAHSFLOW - An expense tracker and financial management tool built with React and Node.js

CAHSFLOW is a web application designed to help users track their expenses and manage their finances effectively. It provides features such as expense tracking, budgeting, and financial reporting. The application is built using React for the frontend and Node.js for the backend.

## Backend

### Routes Docs

The API base path for backend routes is `/api`. Protected endpoints require authentication (the server sets a JWT cookie on login).

---

#### Auth Routes (`/api/auth`)

- POST `/register`
    - Description: Register a new user and send an OTP/email verification link.
    - Body: `{ name: string, email: string, password: string }`
    - Success: `201` — `{ success: true, message: string, data: { user } }`

- GET `/verify-email?token=...`
    - Description: Verify user's email using a token sent in the verification email.
    - Query: `{ token: string }`
    - Success: `200` — `{ success: true, message: string }`

- POST `/resend-verification-email`
    - Description: Resend the email verification OTP/link.
    - Body: `{ email: string }`
    - Success: `201` — `{ success: true, message: string }`

- POST `/verify-otp`
    - Description: Verify an email OTP.
    - Body: `{ email: string, otp: string }`
    - Success: `200` — `{ success: true, message: string }`

- POST `/login`
    - Description: Authenticate user; sets a JWT cookie on success.
    - Body: `{ email: string, password: string }`
    - Success: `200` — `{ success: true, message: string, data?: object }`

- POST `/logout`
    - Description: Clear authentication cookie and logout.
    - Success: `200` — `{ success: true, message: string }`

- POST `/change-password` (Protected)
    - Description: Change the authenticated user's password.
    - Body: `{ oldPassword: string, newPassword: string }`
    - Success: `200` — `{ success: true, message: string }`

---

#### Expense Routes (`/api/expance`)

Note: the project uses the path `/api/expance` (spelled "expance").

- POST `/add` (Protected)
    - Description: Add a new expense for the authenticated user.
    - Body: `{ amount: number, mode: string, to: string, resion: string, description?: string, date?: string }`
        - `mode` enum: `cash | card | UPI | bank_transfer | other`
    - Success: `201` — `{ success: true, message: string, data: { expance } }`

- GET `/` (Protected)
    - Description: Get all expenses for the authenticated user.
    - Success: `200` — `{ success: true, message: string, data: [ expance ] }`

- DELETE `/delete/:id` (Protected)
    - Description: Delete an expense by ID.
    - Params: `:id` — expense id
    - Success: `200` — `{ success: true, message: string, data: { expance } }`

- PUT `/edit/:id` (Protected)
    - Description: Update an expense by ID.
    - Params: `:id` — expense id
    - Body (any subset): `{ amount?: number, mode?: string, to?: string, resion?: string, description?: string, date?: string }`
    - Success: `200` — `{ success: true, message: string, data: { expance } }`

---

#### Income Routes (`/api/income`)

Note: registered under `/api/income` in the server.

- POST `/add` (Protected)
    - Description: Add a new income record for the authenticated user.
    - Body: `{ amount: number, mode: string, from: string, description?: string, date?: string }`
    - Success: `201` — `{ success: true, message: string, data: { income } }`

- GET `/` (Protected)
    - Description: Get all incomes for the authenticated user.
    - Success: `200` — `{ success: true, message: string, data: [ income ] }`

- PUT `/edit/:id` (Protected)
    - Description: Update an income by ID.
    - Params: `:id` — income id
    - Body (any subset): `{ amount?: number, mode?: string, from?: string, description?: string, date?: string }`
    - Success: `200` — `{ success: true, message: string, data: { income } }`

- DELETE `/delete/:id` (Protected)
    - Description: Delete an income by ID.
    - Params: `:id` — income id
    - Success: `200` — `{ success: true, message: string, data: { income } }`

#### Balance Routes (`/api/balance`)
- GET `/` (Protected)
    - Description: Get the current balance for the authenticated user.
    - Success: `200` — `{ success: true, message: string, data: { balance: number } }`
    