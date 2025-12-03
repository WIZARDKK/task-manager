from django.db import models
from django.contrib.auth.models import User


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
