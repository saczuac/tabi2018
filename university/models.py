# -*- coding: utf-8 -*-
from django.db import models

from django.utils.translation import ugettext as _


class University(models.Model):
    name = models.CharField(_('Nombre'), max_length=100)
    latitude = models.CharField(_('Latitud'), max_length=100)
    longitude = models.CharField(_('Longitud'), max_length=100)

    class Meta:
        verbose_name = "Facultad"
        verbose_name_plural = "Facultades"

    def __str__(self):
        return "{}".format(self.name)


class UniversityGroupBlock(models.Model):
    political_block = models.CharField(_('Bloque político'), max_length=100)
    name = models.CharField(_('Nombre'), max_length=100)

    class Meta:
        verbose_name = "UniversityGroupBlock"
        verbose_name_plural = "UniversityGroupBlocks"

    def __str__(self):
        return "{}".format(self.name)
