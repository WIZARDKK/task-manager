from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random


class Task(models.Model):
    CATEGORY_CHOICES = [
        ('Work', 'Work'),
        ('Personal', 'Personal'),
    ]

    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    due_date = models.DateTimeField()
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='Personal'
    )
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class PasswordResetOTP(models.Model):
    """Model to store OTP codes for password reset"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_otps'
    )
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP for {self.user.email} - {self.otp_code}"

    @staticmethod
    def generate_otp():
        """Generate a 6-digit OTP code"""
        return str(random.randint(100000, 999999))

    def is_valid(self):
        """Check if OTP is valid (not used and not expired)"""
        return not self.is_used and timezone.now() < self.expires_at

    def save(self, *args, **kwargs):
        """Set expiration time to 10 minutes from creation"""
        if not self.pk:  # Only on creation
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
