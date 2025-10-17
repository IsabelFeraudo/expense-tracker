from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.db.models import Sum
from django.utils.dateparse import parse_date
from datetime import timedelta
from .models import Transaction
from .serializers import TransactionSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView


class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all().order_by('date', 'id')
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]


class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]


class DailyBalancesView(generics.GenericAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        start_str = request.query_params.get('start')
        end_str = request.query_params.get('end')
        starting_balance = request.query_params.get('startingBalance', '0')

        if not start_str or not end_str:
            return Response({'detail': 'start and end are required as yyyy-MM-dd'}, status=status.HTTP_400_BAD_REQUEST)

        start = parse_date(start_str)
        end = parse_date(end_str)
        if not start or not end or start > end:
            return Response({'detail': 'Invalid date range'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            running = float(starting_balance)
        except ValueError:
            return Response({'detail': 'startingBalance must be a number'}, status=status.HTTP_400_BAD_REQUEST)

        # Aggregate daily deltas within range
        qs = Transaction.objects.filter(date__gte=start, date__lte=end)
        deltas = {}
        for tx in qs.values('date', 'type').annotate(total=Sum('amount')):
            date_key = tx['date'].strftime('%Y-%m-%d')
            delta = float(tx['total']) if tx['type'] == Transaction.TYPE_INCOME else -float(tx['total'])
            deltas[date_key] = deltas.get(date_key, 0.0) + delta

        # Walk the date range and accumulate
        balances = {}
        current = start
        while current <= end:
            key = current.strftime('%Y-%m-%d')
            running += deltas.get(key, 0.0)
            balances[key] = round(running, 2)
            current += timedelta(days=1)

        return Response(balances)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'detail': 'username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})

# Create your views here.
