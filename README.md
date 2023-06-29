# Supply Chain Track and Trace System

## Objective
Design and implement a system that allows users to track and trace supply chain items.

## Components
The system will have two main components:
1. REST API
2. Web Application

## Minimum Requirements (Backend)
The REST API must offer an interface with this set of functions at a minimum:
1. Create a new supply chain item
2. Update supply chain item reference data (colour, price, etc.)
3. Add new events associated with an item (for instance, where the item is, who has the
custody, etc.)
4. Query all events of an item. Particularly, a shortcut to get the last event will be quite
helpful to know the current location / custodian of the item.
5. You can implement using your favourite programming language / framework, database and
cloud environment for the backend.


## Addtional Requirements (Backend)
The following non-functional requirements also need to be met.
1. An OpenAPI / Swagger specification for the API built
2. A JSON Schema that can also be used at runtime for payload validation purposes
3. A Dockerfile for deployment of the API.



# Local Setup

### Prerequisites
1. [Install NodeJS](https://nodejs.org/en/download) on your host machine
2. [Install RabbitMQ](https://www.rabbitmq.com/download.html) on your host machine / Docker image






2. Clone this repository and make it the active directory
```bash
git clone https://github.com/SrMoffat/iota-logistics-backend.git
cd iota-logistics-backend
```
3. Install dependencies
```bash
yarn OR npm install
```
4. Export environment variables (After adding correct values to `.env` as per `.env.example`)
```bash
cat .env.example >> .env
```
5. Export environment variables
```bash
set -o allexport; source .env; set +o allexport
```
6. Start the app
```bash
yarn develop:watch (for hot reload)

NB: This will start two platforms:
1. Admin Portal Webapp on `http://localhost:8000`
1. API Server on `http://localhost:1337`

It will also automaticslly initialize an SQLite database locally
```
7. Open the browser window on `http://localhost:8000` for admin panel webapp 
8. Add a super admin user (needed to manage the admin panel and endpoint permissions)
9. Visit the API url using  Postman, Insomnia or any HTTP client of your choice at `http://localhost:1337/api`
10. Sign a user up on this endpoint
```bash
POST `http://localhost:1337/api/auth/local/register`

{
    "username": "username",
    "email": "email",
    "password": "password"
}
```
11. Login as super admin on the admin panel and make endpoint accessible by:
```bash
Settings > Users & Permissions > Roles > Authenticated
Allow the endpoint under `Stage` `seedStagesAndStatuses` i.e. POST /api/stages/seed
```
12. Seed the database with config tables by making this request
```bash
POST http://localhost:1337/api/stages/seed (Use token from previous step 9 as Bearer <token> in the headers)

No body is required

Success will respond with

{
    "success": true,
    "message": "Seed was successful for Stage, Status, Category and Currency models"
}
```
13. Interact with API endpoints as outlined in [this documentation]( https://documenter.getpostman.com/view/2684804/2s93z9bNL4):
`PS`: Everytime you get `403 Forbidden` error, repeat Step 11 to allow the endpoint to be accessible (this is done only once when setting up)

```bash
1. Sign Up: POST http://localhost:1337/api/auth/local/register
2. Login: POST http://localhost:1337/api/auth/local
3. Seed DB: POST http://localhost:1337/api/stages/seed
4. Add Supply Chain Item: POST http://localhost:1337/api/supply-items (Also publishes a message to RabbitMQ under new-product-created queue)
5. Update Supply Chain Item: PUT http://localhost:1337/api/supply-items
6. Add Events to Supply Chain Item: PUT http://localhost:1337/api/supply-items/:id/events
```





