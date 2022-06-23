from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.conf import settings

# List of groups and permission for each group
GROUPS = []

# [username, email, password, group, is_staff]
USERS = [
    ["test1", "test@systemhealthlab.com", "test1", None, True],
]


class Command(BaseCommand):
    help = "Bootstrap Dev Environment"

    def handle(self, *args, **options):
        add_groups()
        add_users()


def add_groups():
    print("----------------------------------")
    print("Creating/Checking Django Groups...")
    for group_data in GROUPS:
        group, created = Group.objects.get_or_create(name=group_data[0])
        group_action = "Created" if created else "Already Exists"
        print(f"{group_action} group: {group_data[0]}")
        for group_permission in group_data[1]:
            app_label = group_permission[0]
            model = group_permission[1]
            codename = group_permission[2]

            perm = Permission.objects.get(codename=codename, content_type__model=model, content_type__app_label=app_label)
            group.permissions.add(perm)
            print(f"Added permission {group_permission} to {group}")


def add_users():
    print("-----------------------------------------")
    print("Creating/Checking Django user accounts...")

    USER_IS_STAFF_INDEX = -1
    USER_GROUP_INDEX = -2
    CREATE_USER_INDEX_LIMIT = 3

    if settings.APP_ENV in ["LOCAL", "CI"]:
        user_model = get_user_model()
        for user_data in USERS:
            try:
                username = user_data[0]
                if user_model.objects.filter(username__iexact=username).exists():
                    # Do not create if already exists
                    print(f"User account already exists ({username}), skipping creation")
                else:
                    # Create user
                    user = user_model.objects.create_user(*user_data[:CREATE_USER_INDEX_LIMIT])

                    # Set as staff or not
                    user.is_staff = user_data[USER_IS_STAFF_INDEX]
                    user.save()
                    print(f"Created user account: {user}")

                    # assign groups
                    group_defined = user_data[USER_GROUP_INDEX]
                    if group_defined:
                        group = Group.objects.get(name=group_defined)
                        user.groups.add(group)
                        print(f"Added user `{user}` to group `{group}`")

            except Exception as e:
                print("ERROR: User creation/check failed: ", e)
    else:
        print("We only create user accounts in non-production environments \n", f"Environment detected: {settings.APP_ENV} \n")
