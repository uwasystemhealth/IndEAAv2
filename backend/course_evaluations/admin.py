from django.contrib import admin

from course_evaluations.models import CourseEvaluation, EOCGeneral, EOCSet, EOCSpecific


@admin.register(EOCSet)
class EOCSetAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
    )
    search_fields = (
        "id",
        "name",
    )
    ordering = (
        "id",
        "name",
    )


@admin.register(EOCGeneral)
class EOCGeneralAdmin(admin.ModelAdmin):
    list_display = ("id", "number", "title", "eoc_set")
    list_filter = ("eoc_set",)
    search_fields = (
        "id",
        "number",
        "title",
    )
    ordering = ("number",)


@admin.register(EOCSpecific)
class EOCSpecificAdmin(admin.ModelAdmin):
    list_display = ("id", "number", "eoc_general", "get_general_and_specific_eoc", "description")
    list_filter = ("eoc_general",)
    search_fields = ("id", "number", "description")
    ordering = ("number",)


@admin.register(CourseEvaluation)
class CourseEvaluationAdmin(admin.ModelAdmin):
    list_display = ("id", "unit_code", "description", "eoc_set")
    list_filter = ("unit_code", "eoc_set")
    search_fields = ("id", "unit_code", "description")
    ordering = ("created_at",)

    filter_horizontal = ("coordinators",)
