# -*- coding: utf-8 -*-
from django.db import models

from django.utils.translation import ugettext as _


# Dimensión Facultad
class UniversitySchool(models.Model):
    name = models.CharField(_('Nombre'), max_length=100)

    class Meta:
        verbose_name = "University"
        verbose_name_plural = "Universities"
        db_table = 'd_facultad'

    def __str__(self):
        return "{}".format(self.name)


# Dimension Agrupación
class UniversityGroup(models.Model):
    name = models.CharField(_('Nombre'), max_length=100)

    class Meta:
        verbose_name = "UniversityGroup"
        verbose_name_plural = "UniversityGroups"
        db_table = 'd_agrupacion'

    def __str__(self):
        return "{}".format(self.name)


# Tabla de Hechos Votos
class Poll(models.Model):
    university_group = models.ForeignKey(
        UniversityGroup,
        verbose_name=_('Agrupación Universitaria'),
        on_delete=models.PROTECT
    )

    university_school = models.ForeignKey(
        UniversitySchool,
        verbose_name=_('Facultad'),
        on_delete=models.PROTECT
    )

    year = models.IntegerField(_('Año'))

    center_votes = models.IntegerField(_('Votos por centro'))
    cloister_votes = models.IntegerField(_('Votos por claustro'))

    class Meta:
        verbose_name = "Poll"
        verbose_name_plural = "Polls"
        db_table = 'h_votos'

    def __str__(self):
        return "{0} - {1}: Centro -> {2}, Claustro -> {3} || {4}".format(
            self.university_school.name,
            self.university_group.name,
            self.center_votes,
            self.cloister_votes,
            self.year
        )
