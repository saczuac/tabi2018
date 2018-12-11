import os
import random

os.environ['DJANGO_SETTINGS_MODULE'] = 'tabi.settings'

import django

django.setup()

from poll.models import UniversityGroup

from university.models import UniversityGroupBlock


POLITICAL_CHOICES = ['Peronismo', 'PRO', 'Radicales', 'Frente de Izquierda']

for ug in UniversityGroup.objects.all():
    ugb = UniversityGroupBlock()
    ugb.name = ug.name
    ugb.political_block = random.choice(POLITICAL_CHOICES)
    ugb.save()
