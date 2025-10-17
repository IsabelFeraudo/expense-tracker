from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'date', 'type', 'concept', 'amount']

    def validate_amount(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError('Amount must be a positive number.')
        return value

    def validate_type(self, value):
        valid = {Transaction.TYPE_INCOME, Transaction.TYPE_EXPENSE}
        if value not in valid:
            raise serializers.ValidationError('Type must be income or expense.')
        return value


