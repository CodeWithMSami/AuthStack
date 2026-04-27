from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import index, loginUser, logoutUser, signupUser, profileUser, forgotPassword, verifyUser

urlpatterns = [
    path("", index, name='index'),
    path("login", loginUser, name='login'),
    path("logout", logoutUser, name='logout'),
    path("signup", signupUser, name='signup'),
    path("profile", profileUser, name='profile'),
    path("forgot-password", forgotPassword, name='forgot-password'),
    path("verify", verifyUser, name='verify'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)