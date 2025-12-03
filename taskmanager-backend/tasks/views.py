from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import Task, PasswordResetOTP
from .serializers import (
    TaskSerializer,
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    ChangeEmailSerializer,
    RequestPasswordResetSerializer,
    VerifyOTPSerializer,
    ResetPasswordSerializer
)


# ============= TASK VIEWS =============
class TaskViewSet(viewsets.ModelViewSet):
    """ViewSet for managing user tasks"""
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return tasks for the authenticated user
        queryset = Task.objects.filter(user=self.request.user)
        category = self.request.query_params.get('category', None)
        completed = self.request.query_params.get('completed', None)

        if category:
            queryset = queryset.filter(category=category)
        if completed is not None:
            queryset = queryset.filter(
                completed=completed.lower() == 'true'
            )

        return queryset

    def perform_create(self, serializer):
        # Automatically set the user to the current authenticated user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_complete(self, request, pk=None):
        task = self.get_object()
        task.completed = not task.completed
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)


# ============= AUTHENTICATION VIEWS =============
class RegisterView(generics.CreateAPIView):
    """View for user registration"""
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """View for user login"""
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    """View for user logout (blacklists refresh token)"""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """View for getting and updating user profile"""
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """View for changing user password"""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        # Check old password
        if not user.check_password(
            serializer.validated_data['old_password']
        ):
            return Response({
                'error': 'Old password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


class ChangeEmailView(APIView):
    """View for changing user email"""
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ChangeEmailSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)

        user = request.user

        # Verify password before changing email
        if not user.check_password(
            serializer.validated_data['password']
        ):
            return Response({
                'error': 'Password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Update email
        user.email = serializer.validated_data['new_email']
        user.save()

        return Response({
            'message': 'Email changed successfully',
            'email': user.email
        }, status=status.HTTP_200_OK)


# ============= PASSWORD RESET VIEWS =============
class RequestPasswordResetView(APIView):
    """View for requesting password reset OTP via email"""
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.get(email=email)

        # Generate OTP
        otp_code = PasswordResetOTP.generate_otp()

        # Create OTP record
        otp = PasswordResetOTP.objects.create(
            user=user,
            otp_code=otp_code
        )

        # Send OTP via email
        subject = 'Password Reset OTP - Task Manager'
        message = f'''
Hello {user.first_name or user.username},

You requested to reset your password for Task Manager.

Your OTP code is: {otp_code}

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
Task Manager Team
        '''

        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response({
                'message': 'OTP sent successfully to your email',
                'email': email
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # If email fails, delete the OTP and return error
            otp.delete()
            return Response({
                'error': f'Failed to send email: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyOTPView(APIView):
    """View for verifying OTP code without resetting password"""
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response({
            'message': 'OTP verified successfully',
            'email': serializer.validated_data['email']
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """View for resetting password with OTP"""
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        otp = serializer.validated_data['otp']
        new_password = serializer.validated_data['new_password']

        # Set new password
        user.set_password(new_password)
        user.save()

        # Mark OTP as used
        otp.is_used = True
        otp.save()

        # Invalidate all existing OTPs for this user
        PasswordResetOTP.objects.filter(
            user=user,
            is_used=False
        ).update(is_used=True)

        return Response({
            'message': 'Password reset successfully'
        }, status=status.HTTP_200_OK)
