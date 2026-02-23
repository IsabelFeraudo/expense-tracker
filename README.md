# Financial Forecast Planner 💰

Personal full-stack application designed to simulate future financial balance based on scheduled income and expenses.
The system allows users to register planned payments and costs and calculate the exact amount of money available on any future date.
It generates a day-by-day financial projection based on user-defined events.
This project demonstrates frontend architecture, CRUD operations, and business logic implementation for time-based financial simulation.

## Core Business Rules

* Each financial record has:
* amount
* type (income or expense)
* scheduled date
* description
* The system calculates cumulative balance over time
* Users can query financial status for any specific date
* The projection includes only scheduled events

## Features
* Financial calendar visualization
* Expense and income registration form
* Full ABMC (CRUD) for financial records
* Balance calculation for a selected future date
* Time-based financial simulation engine
* Interactive UI with dynamic updates

## Architecture Overview
The application follows a component-based frontend architecture with clear separation between presentation, state management, and business logic.
### Frontend Layer
Responsible for UI rendering and user interaction.
* React functional components
* State management with hooks
* Controlled forms for data input
* Event-driven updates
* Modular component structure

### Business Logic Layer
Encapsulates financial calculation rules and simulation behavior.
* Balance projection algorithm
* Date-based filtering
* Aggregation of scheduled events
* Deterministic calculation engine

### Data Model
Represents scheduled financial events.
Each record includes:
* id
* amount
* type (income / expense)
* date
* description

## Technical Skills Demonstrated
* Frontend Engineering
* React architecture and reusable components
* Form handling and validation
* State management with hooks
* Conditional rendering
* Data-driven UI design

### Software Design
* Separation of concerns
* Modular architecture
* Business logic abstraction
* Predictable data flow

### Problem Solving
* Time-based simulation
* Financial forecasting logic
* Handling scheduled events
* User-centered design

## Tech Stack
* JavaScript (ES6+)
* React
* HTML5
* CSS3
* Create React App

## Getting Started
1 Clone repository
git clone <repository-url>
cd <project-folder>
2 Install dependencies
npm install
3 Run application
npm start

Open:
http://localhost:3000

4 Run tests
npm test
5 Production build
npm run build

## Use Case Example
1. Register upcoming expenses and income
2. Select a future date
3. View projected financial balance
4. Analyze daily financial evolution

## Portfolio Value
* This project showcases the ability to:
* Translate real-world problems into software solutions
* Implement business rules in JavaScript
* Build interactive data-driven applications
* Design structured frontend architectures
* Develop maintainable and scalable UI logic

## Author
Isabel Feraudo
Full Stack Developer — React | Python | Django | FastAPI
