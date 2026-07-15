from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.conf import settings


class CustomUserManager(BaseUserManager):

    def _create_user(self, email, phonenumber=None, fullname=None, username=None, password=None, **extra_fields):
        
        if not email:
            raise ValueError("Email must be set")
        
        email = self.normalize_email(email)

        user = self.model(
            email=email,
            phonenumber=phonenumber,
            fullname=fullname,
            username=username,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user
    
    def create_user(self, email, phonenumber=None, fullname=None, username=None, password=None, role="user", **extra_fields):

        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        return self._create_user(
            email=email,
            phonenumber=phonenumber,
            fullname=fullname,
            password=password,
            username=username,
            role=role,
            **extra_fields
        )
    
    def create_superuser(self, email, phonenumber=None, fullname=None, username=None, password=None, role="admin", **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("admin must have all access")
        
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("select superuser to activate admin access")
        
        return self._create_user(
            email=email,
            phonenumber=phonenumber,
            fullname=fullname,
            password=password,
            username=username,
            role=role,
            **extra_fields
        )
    

class CustomUser(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = [

        ("admin", "Admin"),
        ("staff", "Staff"),
        ("user", "User")

    ]
    email = models.EmailField(unique=True, null=False, blank=False)
    phonenumber = models.CharField(unique=True, null=True, blank=True, max_length=13)
    password = models.CharField(unique=False, blank=False, null=False, max_length=20)
    fullname = models.CharField(unique=False, blank=True, null=True, max_length=100)
    #lastname = models.CharField(unique=False, blank=False, null=True, max_length=100)
    username = models.CharField(unique=True, blank=True, null=True, max_length=100)
    role = models.CharField(unique=False, blank=True, null=True, choices=ROLE_CHOICES, default="user")

    #Extra Fields

    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects=CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    

class UserWallet(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wallet")
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tatal_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"wallet name {self.user.email} salio:{self.balance}"
    

class WalletTransaction(models.Model):

    TRANSACTION_TYPES = [

        ('Deposit', 'Deposit amount (Add funds)'),
        ('Order_Payment', 'Malipo ya Oda (SMM/SMS/PHONENUMBER)'),

    ]

    STATUS_CHOICES = [

        ('Pending', 'Inasubiri'),
        ('Success', 'Imekamilika'),
        ('Failed', 'Imefeli')

    ]

    wallet = models.ForeignKey(UserWallet, on_delete=models.CASCADE, related_name="transactions")
    transaction_type = models.CharField(max_length=50, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Kiasi (TSh)")
    description = models.TextField(blank=True, null=True)
    stutus = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Sucess')

    def __str__(self):
        return f"{self.wallet.user.email} | {self.transaction_type} | TZS {self.amount}"

