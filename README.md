# AuthStack 🔐

[![Django Version](https://img.shields.io/badge/Django-4.2+-green.svg)](https://www.djangoproject.com/)
[![Python Version](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AuthStack** is a modern, full-featured Django authentication system with a built-in user balance system and fully customizable UI. It provides a secure, ready-to-use foundation for web applications requiring user accounts, email verification, password recovery, and virtual currency/credit management.

## ✨ Features

### 🔐 Authentication
- User registration & login with email validation
- Email verification system
- Password reset via email ("Forgot Password")
- Session management & secure logout
- Profile editing with avatar upload

### 💰 Balance System
- Each user has a personal balance (credits/points/virtual currency)
- Add/deduct balance with transaction history
- Transfer balance between users (optional)
- Balance-based access control for premium features

### 🎨 UI & Customization
- Modern glassmorphism design
- Fully responsive (mobile, tablet, desktop)
- Easy to customize CSS variables
- Animated transitions & micro-interactions
- Separate CSS and JS files for clean code

### 🔧 Technical Stack
- **Backend**: Django (Python)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: SQLite (default), supports PostgreSQL/MySQL
- **Authentication**: Django's built-in auth system + custom enhancements
- **File Upload**: Profile picture handling

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeWithMSami/AuthStack.git
   cd AuthStack```

2. **Create a virtual environment**
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate```

3. **Install dependencies**
    ```bash
    pip install django```

4. **Run migrations**
    ```bash
    python manage.py makemigrations
    python manage.py migrate```

5. **Create a superuser (admin)**
    ```bash
    python manage.py createsuperuser```

6. **Start the development server**
    ```bash
    python manage.py runserver```

7. **Open your browser and navigate to http://127.0.0.1:8000**