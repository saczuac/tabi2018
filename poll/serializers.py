from rest_framework import serializers
from .models import Poll


class PollSerializer(serializers.ModelSerializer):
    university_group = serializers.SerializerMethodField()
    university_school = serializers.SerializerMethodField()

    def get_university_group(self, obj):
        return self.university_group.name

    def get_university_school(self, obj):
        return self.university_school.name

    class Meta:
        model = Poll
        fields = '__all__'