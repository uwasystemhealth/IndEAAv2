from django.contrib import admin

from reviews.models import Review, ReviewDocument, ReviewEocSpecific


# Register your models here.
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "course_evaluation", "final_comment", "date_submitted")
    ordering = ("created_at",)


@admin.register(ReviewDocument)
class ReviewDocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "review", "document", "is_viewed", "comment")
    ordering = ("created_at",)


@admin.register(ReviewEocSpecific)
class ReviewEocSpecificAdmin(admin.ModelAdmin):
    list_display = ("id", "review", "eoc_specific", "development_level", "suggestion", "justification")
    ordering = ("created_at",)
