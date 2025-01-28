# Running the Django Application

## Prerequisites
- Python 3.x
- Django (install via `pip install django`)

## Steps to Run

1. Navigate to the project directory:
```bash
cd /path/to/complaint_system
```

2. Apply database migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Create a superuser (admin) account:
```bash
python manage.py createsuperuser
```

4. Start the development server:
```bash
python manage.py runserver
```

5. Access the application:
- Main site: http://127.0.0.1:8000/
- Admin interface: http://127.0.0.1:8000/admin/

## Development

To install additional dependencies:
```bash
pip install -r requirements.txt
```
