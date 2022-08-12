from django.contrib import admin
from documents.models import Documents


# @admin.register(Documents)
# class DocumentsAdmin(admin.ModelAdmin):
#     list_display = ("id", "name", "link", "description", "isInIntroduction")
#     list_filter = ("name", "eoc_set", "isInIntroduction")
#     search_fields = ("id", "name", "link", "description", "isInIntroduction")
#     ordering = ("name",)

admin.site.register(Documents)
