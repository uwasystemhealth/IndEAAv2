from django.contrib import admin
from reviews.models import Review

# Register your models here.
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "course_evaluation", "final_comment", "date_submitted")
    ordering = ("created_at",)
