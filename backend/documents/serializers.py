from rest_framework import serializers

from documents.models import Documents


class DocumentsListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = ("id", "name", "link", "description")


class DocumentsDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = "__all__"
