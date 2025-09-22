# PostgreSQL + Drizzle Setup Guide

## 1. Install PostgreSQL

### macOS (using Homebrew):
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows:
Download and install from: https://www.postgresql.org/download/windows/

## 2. Create Database

Connect to PostgreSQL and create a database:

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE expenses_db;

# Create user (optional)
CREATE USER expenses_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE expenses_db TO expenses_user;

# Exit psql
\q
```

## 3. Set Environment Variables

Create a `.env` file in the `api` directory:

```bash
# In /api/.env
DATABASE_URL="postgresql://username:password@localhost:5432/expenses_db"

# Example with default postgres user:
DATABASE_URL="postgresql://postgres:password@localhost:5432/expenses_db"

# Example with custom user:
DATABASE_URL="postgresql://expenses_user:your_password@localhost:5432/expenses_db"
```

## 4. Generate and Run Migrations

```bash
# Navigate to api directory
cd api

# Generate migration files
bun run db:generate

# Push schema to database (for development)
bun run db:push

# Or run migrations (for production)
bun run db:migrate
```

## 5. Start the Application

```bash
# Start the API server
bun run dev
```

## 6. Optional: Open Drizzle Studio

Drizzle Studio provides a GUI to view and manage your database:

```bash
bun run db:studio
```

This will open a web interface at `http://localhost:4983` where you can:
- View tables and data
- Run queries
- Manage records

## Database Schema

The expenses table includes:
- `id`: Auto-incrementing primary key
- `title`: Expense title (required)
- `amount`: Expense amount as decimal
- `date`: Expense date
- `userId`: User ID from authentication (required)
- `createdAt`: Timestamp when record was created
- `updatedAt`: Timestamp when record was last updated

## Troubleshooting

### Connection Issues:
1. Make sure PostgreSQL is running: `brew services list | grep postgresql`
2. Check your DATABASE_URL format
3. Verify database exists: `psql -l`

### Permission Issues:
1. Make sure your user has access to the database
2. Check PostgreSQL logs for detailed error messages

### Migration Issues:
1. Make sure your schema is correct
2. Check if database exists and is accessible
3. Try using `db:push` instead of `db:migrate` for development
