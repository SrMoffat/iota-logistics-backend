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

## Minimum Requirements (Frontend)
The Web Application, (Single Page Application) at a minimum, must:
1. Offer end users the capability to query the supply chain trail of an item by using the query interface offered by the
REST API. 
2. It must be Javascript / TypeScript using your favourite SPA framework.


## Addtional Requirements (Frontend)
The following bonus requirements could also be met:
1. Responsive web application, as mobile users are also expected.
2. Dockerfile for deployment of the Web application.
