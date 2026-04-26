from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, template_name='index.html')

def loginUser(request):
    return render(request, template_name='login.html')

def signupUser(request):
    return render(request, template_name='signup.html')

def profileUser(request):
    return render(request, template_name='profile.html')

def forgotPassword(request):
    return render(request, template_name='forgot-password.html')

def verifyUser(request):
    return render(request, template_name='verify-email.html')