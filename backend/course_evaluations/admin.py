from django.contrib import admin

from course_evaluations.models import (
    CourseEvaluation,
    CourseEvaluationJustification,
    EOCGeneral,
    EOCSet,
    EOCSpecific,
    Document
)


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
    list_display = (
        "id",
        "number",
        "eoc_general",
        "general_and_specific_eoc",
        "description",
    )
    list_filter = ("eoc_general",)
    search_fields = ("id", "number", "description")
    ordering = ("number",)


@admin.register(CourseEvaluationJustification)
class CourseEvaluationJustificationAdmin(admin.ModelAdmin):
    list_display = ("id", "course_evaluation", "justification")
    list_filter = ("course_evaluation",)
    search_fields = ("id", "justification")
    ordering = ("id",)

    filter_horizontal = ("eoc_specifics",)


@admin.register(CourseEvaluation)
class CourseEvaluationAdmin(admin.ModelAdmin):
    list_display = ("id", "unit_code", "description", "eoc_set")
    list_filter = ("unit_code", "eoc_set")
    search_fields = ("id", "unit_code", "description")
    ordering = ("created_at",)

    filter_horizontal = ("coordinators",)

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "course_evaluation", "name", "url")
    list_filter = ("course_evaluation","is_introduction")
    search_fields = ("id", "name","description")
    ordering = ("id",)

    filter_horizontal = ("eoc_generals","eoc_specifics",)