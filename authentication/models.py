from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, auto_created=True)
    picture = models.ImageField(upload_to='profiel_pictures/', null=True, blank=True, default='icon.png')
    
    def __str__(self):
        return self.username