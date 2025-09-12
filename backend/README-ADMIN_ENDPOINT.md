Promote user to admin - API

Endpoint
POST /api/admin/promote

Headers
- Authorization: Bearer <admin-jwt-token>
- Content-Type: application/json

Body (one of):
- { "email": "user@example.com" }
- { "userId": "<mongodb-id>" }

Example (PowerShell using curl alias):

$token = '<ADMIN_JWT_TOKEN_FROM_LOGIN>'
curl -X POST http://localhost:5000/api/admin/promote -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d '{"email":"user@example.com"}'

Notes
- The request must be made by an already-admin user (the `protect` + `isAdmin` middleware enforces this).
- To get an admin token initially, either set ADMIN_EMAILS so first Google sign-in creates an admin, or manually update the DB to set a user to role 'admin'.
