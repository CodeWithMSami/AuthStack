from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

User = get_user_model()

def index(request: HttpRequest):
    context = {
        "is_authenticated": False
    }
    
    if request.user.is_authenticated:
        context['is_authenticated'] = True
        
    return render(request, template_name='index.html', context=context)

def loginUser(request: HttpRequest):
    if request.user.is_authenticated:
        messages.info(request=request, message='User already logged in.')
        return redirect("/")
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember')
        
        user = authenticate(request=request, username=username, password=password)
        
        if user is not None:
            login(request=request, user=user)
            
            if remember_me:
                request.session.set_expiry(30*24*60*60)
            else:
                request.session.set_expiry(7*24*60*60)
                
            messages.success(request=request, message='Logged in successfully.')
            return redirect('/')
        else:
            messages.error(request=request, message="Invalid username or password.")
        
    return render(request, template_name='login.html')

def signupUser(request: HttpRequest):
    if request.user.is_authenticated:
        messages.info(request=request, message='User is logged in.')
        return redirect("/")
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm-password')
        
        if not username or not email or not password or not confirm_password:
            messages.error(request=request, message="Field required.")
            return redirect("signup")
        
        elif password != confirm_password:
            messages.error(request=request, message="Password must match Confirm Password.")
            return redirect("signup")
        
        try:
            validate_password(password=password)
        except ValidationError as ve:
            for e in ve.messages:
                messages.error(request=request, message=e)
            return redirect("signup")
        
        if User.objects.filter(username=username).exists():
            messages.error(request=request, message="Username already taken.")
            return redirect("signup")
        
        if User.objects.filter(email=email).exists():
            messages.error(request=request, message="Email already taken.")
            return redirect("signup")
        
        user = User.objects.create_user(username=username, email=email, password=password)
        
        login(request=request, user=user)
        
        messages.success(request=request, message='User created successfully.')
        
        return redirect('/verify')
        
    return render(request, template_name='signup.html')

def profileUser(request: HttpRequest):
    return render(request, template_name='profile.html')

def forgotPassword(request: HttpRequest):
    return render(request, template_name='forgot-password.html')

def verifyUser(request: HttpRequest):
    # if request.method == 'P'
    return render(request, template_name='verify-email.html')

def logoutUser(request: HttpRequest):
    if request.user.is_authenticated:
        logout(request=request)
        messages.success(request=request, message='User logged out successfully.')
        return redirect('login')
    return redirect('login')