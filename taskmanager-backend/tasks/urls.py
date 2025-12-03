from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    TaskViewSet,
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    ChangePasswordView,
    ChangeEmailView
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    # ============= AUTHENTICATION ENDPOINTS =============
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    path('auth/change-password/',
         ChangePasswordView.as_view(),
         name='change_password'),
    path('auth/change-email/',
         ChangeEmailView.as_view(),
         name='change_email'),

    # ============= TASK ENDPOINTS =============
    path('', include(router.urls)),
]
