# MongoDB Setup with Docker Compose

## Quick Start

1. **Start MongoDB:**
   ```bash
   docker-compose up -d
   ```

2. **Initialize Database with Sample Data:**
   ```bash
   npm run db:init:sample
   ```

3. **Access Mongo Express UI:**
   Open http://localhost:8081 in your browser

## Database Scripts

### Available NPM Commands

```bash
# Check database connection and show collections
npm run db:check

# Initialize empty collections with indexes
npm run db:init

# Initialize collections with sample data
npm run db:init:sample

# Seed database with data (keeps existing)
npm run db:seed

# Clear all data and reseed
npm run db:seed:clear
```

### What Gets Created

#### Collections:
- **users** - User profiles with validation
- **posts** - Blog posts with author references

#### Sample Data (with `--sample-data`):
- 2 sample users (Max Mustermann, Anna Schmidt)
- 4 sample blog posts (3 published, 1 draft)
- Comments and likes on posts

## Services

### MongoDB (Port 27017)
- Connection string: `mongodb://admin:secretpassword@localhost:27017/mein-blog?authSource=admin`
- Database name: `mein-blog`
- Data persists between container restarts
- Authentication enabled (admin/secretpassword)

### Mongo Express (Port 8081)
- Web UI: http://localhost:8081
- Visual database management interface
- Credentials: admin/secretpassword

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services (keeps data)
docker-compose down

# Stop and remove all data
docker-compose down -v

# View logs
docker-compose logs -f mongodb

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p secretpassword --authenticationDatabase admin

# Check status
docker-compose ps

# Restart services
docker-compose restart
```

## Data Persistence
MongoDB data is stored in named Docker volumes:
- `mein-blog-mongodb-data`: Database files
- `mein-blog-mongodb-config`: Configuration files

## Environment Configuration

The `.env` file should contain:
```env
MONGODB_URI="mongodb://admin:secretpassword@localhost:27017/mein-blog?authSource=admin"
```

## Complete Setup Flow

1. **First Time Setup:**
   ```bash
   # Start MongoDB
   docker-compose up -d

   # Wait a few seconds for MongoDB to initialize
   sleep 5

   # Create collections and add sample data
   npm run db:init:sample

   # Check database status
   npm run db:check

   # Start the application
   npm run dev
   ```

2. **Reset Database:**
   ```bash
   # Clear and reseed
   npm run db:seed:clear
   ```

3. **Clean Start:**
   ```bash
   # Remove everything
   docker-compose down -v

   # Start fresh
   docker-compose up -d
   npm run db:init:sample
   ```

## Troubleshooting

- **Connection refused:** Ensure Docker is running and port 27017 is not in use
- **Authentication failed:** Check credentials in `.env` match `docker-compose.yml`
- **Data not persisting:** Check volumes with `docker volume ls`
- **Endless restart:** Run `docker-compose logs mongodb` to check for errors
- **Performance issues:** Allocate more resources in Docker Desktop settings