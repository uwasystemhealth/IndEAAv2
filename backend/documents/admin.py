from django.contrib import admin

from documents.models import Document

# Register your models here.


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "course_evaluation", "name", "url", "is_introduction")
    search_fields = ("id", "name", "description", "justification")

    list_filter = (
        "course_evaluation",
        "is_introduction",
    )

    filter_horizontal = (
        "eoc_generals",
        "eoc_specifics",
    )
