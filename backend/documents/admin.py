from django.contrib import admin

from documents.models import Document

# Register your models here.


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "url", "is_introduction")
