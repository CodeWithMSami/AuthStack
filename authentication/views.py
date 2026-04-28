from django.shortcuts import render, redirect
from django.http import HttpRequest
from django.contrib import messages
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
import os
from datetime import datetime

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
    if not request.user.is_authenticated:
        messages.info(request=request, message='Please login first.')
        return redirect("login")
    
    if request.method == 'POST':
        username = request.POST.get('username')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')
        
        has_changes = False
        
        if username and username != request.user.username:
            if User.objects.exclude(pk=request.user.pk).filter(username=username).exists():
                messages.error(request=request, message='Username already taken.')
            else:
                request.user.username = username
                has_changes = True
        
        if first_name != request.user.first_name:
            request.user.first_name = first_name
            has_changes = True
                   
        if last_name != request.user.last_name:
            request.user.last_name = last_name
            has_changes = True
            
        if email and email != request.user.email:
            if User.objects.exclude(pk=request.user.pk).filter(email=email).exists():
                messages.error(request=request, message='Email is already taken.')
            else:
                request.user.email = email
                has_changes = True
                
        if 'profile_pic' in request.FILES and request.FILES['profile_pic']:
            profile_pic = request.FILES['profile_pic']
            
            if profile_pic.size > 5*1024*1024:
                messages.error(request=request, message='File is too large. Maximum 5MB is allowed.')
            else:
                allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
                if profile_pic.content_type not in allowed_types:
                    messages.error(request=request, message="Invalid file type. Please upload JPEG, PNG, GIF, or WEBP images.")
                else:
                    if request.user.picture:
                        old_pic_path = request.user.picture.path
                        if os.path.isfile(old_pic_path):
                            os.remove(old_pic_path)
                        file_extension = profile_pic.name.split('.')[-1]
                        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                        new_filename = f"{request.user.username}_{timestamp}.{file_extension}"
                        request.user.picture.save(new_filename, profile_pic)
                        has_changes = True
                        
        if new_password or confirm_password or current_password:
            if not current_password:
                messages.error(request, 'Current password is required to change password.')
            elif not request.user.check_password(current_password):
                messages.error(request, 'Current password is incorrect.')
            elif not new_password:
                messages.error(request, 'New password is required.')
            elif new_password != confirm_password:
                messages.error(request, 'New passwords do not match.')
            elif len(new_password) < 8:
                messages.error(request, 'Password must be at least 8 characters long.')
            else:
                request.user.set_password(new_password)
                has_changes = True
                # Update session to prevent logout
                update_session_auth_hash(request, request.user)
                messages.success(request, 'Password changed successfully!')
                
        if has_changes:
            request.user.save()
            messages.success(request, 'Your profile has been updated successfully!')
        elif not any([current_password, new_password, confirm_password]) and 'profile_pic' not in request.FILES:
            messages.info(request, 'No changes were made to your profile.')
            
    context = {
        "user": request.user
    }
        
    return render(request, template_name='profile.html', context=context)

def forgotPassword(request: HttpRequest):
    if request.user.is_authenticated:
        messages.info(request=request, message='User is logged in.')
        return redirect("/")
    
    return render(request, template_name='forgot-password.html')

def verifyUser(request: HttpRequest):
    if request.user.verified:
        messages.info(request=request, message="User is already verified.")
        return redirect('/')
                
    return render(request, template_name='verify-email.html')

def logoutUser(request: HttpRequest):
    if request.user.is_authenticated:
        logout(request=request)
        messages.success(request=request, message='User logged out successfully.')
        return redirect('login')
    return redirect('login')