import os
from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Create media and complaints directories
COMPLAINTS_DIR = os.path.join(MEDIA_ROOT, 'complaints')
os.makedirs(COMPLAINTS_DIR, exist_ok=True)

# ...existing code...
