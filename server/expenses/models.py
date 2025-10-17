from django.db import models


class Transaction(models.Model):
    TYPE_INCOME = 'income'
    TYPE_EXPENSE = 'expense'
    TYPE_CHOICES = [
        (TYPE_INCOME, 'Income'),
        (TYPE_EXPENSE, 'Expense'),
    ]

    # ISO date string 'yyyy-MM-dd' mapped as DateField
    date = models.DateField(db_index=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, db_index=True)
    concept = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['type', 'date']),
        ]
        ordering = ['date', 'id']

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.amount is None or self.amount <= 0:
            raise ValidationError({'amount': 'Amount must be a positive number.'})
        if self.type not in {self.TYPE_INCOME, self.TYPE_EXPENSE}:
            raise ValidationError({'type': 'Type must be income or expense.'})

    def __str__(self):
        return f"{self.date} {self.type} {self.concept} {self.amount}"
