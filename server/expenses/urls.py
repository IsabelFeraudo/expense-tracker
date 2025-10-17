from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views

urlpatterns = [
    path('transactions/', views.TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-detail'),
    path('balances/daily/', views.DailyBalancesView.as_view(), name='daily-balances'),
    path('auth/login/', obtain_auth_token, name='api-token-auth'),
    path('auth/register/', views.RegisterView.as_view(), name='api-register'),
]


