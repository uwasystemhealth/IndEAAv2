from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """
    Creates a superuser with the arguments provided.
    If user already exists, it ensures email is lowercase and sets the password specified.

    Needs to be passed 'username', 'email' and 'password'

    example: python manage.py make_superuser admin admin@admin.com Password123

    """

    def add_arguments(self, parser):
        # Positional arguments
        parser.add_argument("username", type=str)
        parser.add_argument("email", type=str)
        parser.add_argument("password", type=str)

    def handle(self, *args, **options):
        username = options.get("username").lower()
        email = options.get("email").lower()
        password = options.get("password")

        User = get_user_model()

        print(" ")
        print("------------ Superuser Creation Starting... --------------------")
        print(" ")
        print(f"Superuser Username: {username}")
        print(f"Superuser Email: {email}")
        print("Superuser Password: <hidden>")
        print(" ")

        try:
            # Check if the user exists and create if missing
            if User.objects.filter(username__iexact=username).exists():
                primary_superuser = User.objects.get(username__iexact=username)
                print("Superuser already exists...")

            else:
                print("Superuser not found, creating...")
                # Create user account as superuser/admin
                primary_superuser = User.objects.create_superuser(username, email, password)

                primary_superuser.is_active = True
                primary_superuser.save()
                print(" -> Superuser created successfully")

            print(" ")
            print(f"Superuser details (pk={primary_superuser.pk}, username={primary_superuser.username})")
            print(" ")
            print("------------ Superuser Creation Completed Successfully --------------------")
        except Exception as e:
            print("ERROR: Superuser creation failed: ", e)
