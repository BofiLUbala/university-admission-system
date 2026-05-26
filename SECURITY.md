# Security & Environment Variables Guide

## Overview
This project uses environment variables to store sensitive data such as:
- Database credentials
- Django SECRET_KEY
- API keys
- JWT tokens
- Third-party service credentials

Never commit sensitive data to version control!

## Setup Instructions

### 1. Backend (.env file)

1. Copy the example file:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your actual values:
```bash
nano .env  # or use your preferred editor
```

3. Required variables for local development:
```
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=your-development-secret-key
DB_ENGINE=django.db.backends.sqlite3  # For local SQLite
```

4. For production, use PostgreSQL:
```
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=<generate-a-secure-key>
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=<secure-password>
DB_HOST=your_db_host
DB_PORT=5432
```

### 2. Frontend (.env.local file)

1. Copy the example file:
```bash
cd frontend
cp .env.example .env.local
```

2. Edit `.env.local`:
```
VITE_API_URL=http://localhost:8000/api/
```

## Important Security Notes

### Do NOT
- ❌ Commit `.env` files to version control
- ❌ Use default/placeholder values in production
- ❌ Share secrets in chat, emails, or code reviews
- ❌ Store secrets in version control history
- ❌ Use weak or predictable secrets

### DO
- ✅ Use `.env.example` as a template (can be committed)
- ✅ Generate strong secrets (use `python manage.py shell` → `from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())`)
- ✅ Use different values for dev and production
- ✅ Rotate secrets regularly in production
- ✅ Use a secrets management service in production (AWS Secrets Manager, HashiCorp Vault, etc.)

## Generating Secrets

### Django SECRET_KEY
```bash
python manage.py shell
```
Then in Python:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### PostgreSQL Password
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GenerateRandomBytes(32))
```

## Environment Variables Reference

### Backend (Django)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DJANGO_DEBUG` | No | False | Enable debug mode (set to False in production) |
| `DJANGO_SECRET_KEY` | Yes | - | Secret key for Django sessions |
| `DB_NAME` | No | - | Database name (for PostgreSQL) |
| `DB_USER` | No | - | Database user (for PostgreSQL) |
| `DB_PASSWORD` | No | - | Database password (for PostgreSQL) |
| `DB_HOST` | No | - | Database host (for PostgreSQL) |
| `DB_PORT` | No | 5432 | Database port |
| `CORS_ALLOWED_ORIGINS` | No | * | Allowed CORS origins |
| `EMAIL_HOST_PASSWORD` | No | - | Email service password |

### Frontend (React/Vite)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | http://localhost:8000/api/ | Backend API URL |
| `VITE_APP_NAME` | No | - | Application name |

## GitHub/Repository Security

1. **.gitignore** - Already includes `.env` files:
   ```
   **/.env
   **/.env.*
   ```

2. If you accidentally committed secrets:
   ```bash
   # Remove from git history (careful!)
   git filter-branch --tree-filter 'rm -f .env' HEAD
   git push -f origin master
   ```

   Or use BFG Repo-Cleaner for large repos.

3. Regenerate all exposed secrets immediately!

## Deployment Checklist

- [ ] Generate new `DJANGO_SECRET_KEY` for production
- [ ] Set `DJANGO_DEBUG=False`
- [ ] Configure PostgreSQL with strong password
- [ ] Set `ALLOWED_HOSTS` to your domain
- [ ] Configure CORS origins to specific domains
- [ ] Set up SSL/HTTPS
- [ ] Configure email service credentials
- [ ] Use a secrets management service
- [ ] Enable database backups
- [ ] Monitor and log access

## Useful Commands

```bash
# Check if .env is in .gitignore
git check-ignore -v .env backend/.env frontend/.env.local

# List all environment variables being used
grep -r "os.environ.get\|process.env\|import.meta.env" backend frontend --include="*.py" --include="*.js" --include="*.jsx"

# Create .env from .env.example (bash)
cat .env.example > .env

# Verify .env is not tracked
git status | grep ".env"  # Should return nothing
```

## References
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
