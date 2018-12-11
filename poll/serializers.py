from rest_framework import serializers
from .models import Poll, UniversitySchool

from university.models import University, UniversityGroupBlock


class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UniversitySchool
        fields = '__all__'


class PollSerializer(serializers.ModelSerializer):
    university_group = serializers.SerializerMethodField()
    university_school = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    political_block = serializers.SerializerMethodField()
    year = serializers.SerializerMethodField()

    def get_year(self, obj):
        return obj.year.year

    def get_university_group(self, obj):
        return obj.university_group.name

    def get_university_school(self, obj):
        return obj.university_school.name

    def get_political_block(self, obj):
        ug = UniversityGroupBlock.objects.filter(
            name=obj.university_group.name
        )

        if ug:
            return ug.first().political_block
        return ''

    def get_longitude(self, obj):
        university = University.objects.filter(
            name=obj.university_school.name
        )

        if university:
            return university.first().longitude
        return ''

    def get_latitude(self, obj):
        university = University.objects.filter(
            name=obj.university_school.name
        )

        if university:
            return university.first().latitude
        return ''

    class Meta:
        model = Poll

        fields = (
            'university_group',
            'university_school',
            'center_votes',
            'year',
            'cloister_votes',
            'political_block',
            'latitude',
            'longitude',
        )
