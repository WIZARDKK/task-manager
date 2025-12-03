from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'category',
        'due_date',
        'completed',
        'user',
        'created_at'
    ]
    list_filter = ['category', 'completed', 'created_at']
    search_fields = ['title', 'notes']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
