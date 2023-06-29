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
5. Start the app
```bash
yarn develop:watch (for hot reload)

NB: This will start two platforms:
1. Admin Portal Webapp on `http://localhost:8000`
1. API Server on `http://localhost:1337`

It will also automaticslly initialize an SQLite database
```
6. Open the browser window on `http://localhost:8000` for admin panel webapp 
7. Add a super admin user
8. Seed the database with config tables by making this request
```bash
POST http://localhost:1337/api/stages/seed (No auth required for now)
```
7. 
9. Open Postman, Insomnia or any HTTP client of your choice and interact with the API on `http://localhost:1337/api`




