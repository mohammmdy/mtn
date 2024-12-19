# MTN App Setup Guide

## Steps to Set Up the MTN Application

### 1. Clone the Repository
Pull the repository from GitHub:
```bash
git clone <repository-url>
```

### 2. Create `config.env`
Set up a `config.env` file in the root directory with the following content:
```env
NODE_ENV=development

# Database Connection
DATABASE_URL=postgres://postgres:135710@localhost:5432/mtn
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=135710
DB_NAME=mtn
DB_PORT=5432

## JWT
JWT_SECRET_KEY=123MNQD@4234mflozzziu
JWT_EXPIRE_TIME=15m

## JWT Refresh
JWT_REFRESH_SECRET_KEY=123MfQg@42649flozzziu
JWT_REFRESH_EXPIRE_TIME=7d
```

### 3. Install Dependencies
Run the following command to install the required packages:
```bash
npm install
```

---

## Running the MTN App Normally

### 4. Set Up the Database
Create the database in your local PostgreSQL:
```sql
CREATE DATABASE mtn;
```

### 5. Generate Database Schemas
Run the following command to generate the schemas:
```bash
npm run db:generate
```
> Use this command whenever changes are made to the database schema.

### 6. Migrate Database Schemas
Migrate the schemas into the `mtn` database:
```bash
npm run db:migrate
```
> Use this command whenever changes are made to the database schema.

### 7. View Database UI
Run the following command to view the database in a user interface:
```bash
npm run studio
```

### 8. Start the Application
Start the application by running:
```bash
npm run start
```
This will provide a Swagger UI link in the terminal for testing the APIs.

---

## Running the MTN App in Docker

### 4. Update `config.env` for Docker
Update the `config.env` file with the following changes:
```env
DATABASE_URL=postgres://postgres:135710@db:5432/mtn
DB_HOST=db
```

### 5. Build and Start the Docker Container
Run the following command to build the application container and start it:
```bash
docker-compose up --build -d
```

### 6. Generate Database Schemas in Docker
If changes are made to the database schema, run:
```bash
docker-compose exec app npm run db:generate
```

### 7. Migrate Database Schemas in Docker
If schema migration is required, run:
```bash
docker-compose exec app npm run db:migrate
```

### 8. Shut Down the Docker Container
To stop the Docker container, run:
```bash
docker-compose down
```

### 9. Test APIs
Access the Swagger UI in your browser:
```
http://localhost:8000/api-docs/
```
Use this interface to test the APIs.

---

## Notes
- Always update the `config.env` file with the correct database credentials and environment variables.
- Ensure Docker is installed and running if using the Docker setup.
- For any database schema changes, use the appropriate `db:generate` and `db:migrate` commands.

