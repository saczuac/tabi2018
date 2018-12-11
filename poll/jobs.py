# -*- coding: utf-8 -*-
import requests

from .models import UniversitySchool, UniversityGroup, Poll, PollYear

from django.db.utils import IntegrityError

from bs4 import BeautifulSoup


UNIVERSITY_SCHOOL = {
    'Facultad de Periodismo y Comunicación': 'Facultad de Periodismo y Comunicación Social',
    'Facultad de Cs. Jurídicas y': 'Facultad de Ciencias Jurídicas y Sociales',
    'Facultad de Arquitectura y': 'Facultad de Arquitectura y Urbanismo',
    'Facultad de Humanidades y Cs. de la': 'Facultad de Humanidades y Ciencias de la Educación',
    'Facultad de Cs. Económicas': 'Facultad de Ciencias Económicas',
    'Facultad de Cs. Astronómicas y': 'Facultad de Ciencias Astronómicas y Geofísicas',
    'Facultad de Humanidades y Cs. de la Educación': 'Facultad de Humanidades y Ciencias de la Educación',
    'Facultad de Cs. Médicas': 'Facultad de Ciencias Médicas',
    'Facultad de Cs. Jurídicas y Sociales': 'Facultad de Ciencias Jurídicas y Sociales',
    'Facultad de Cs. Exactas': 'Facultad de Ciencias Exactas',
    'Facultad de Cs. Astronómicas y Geofísicas': 'Facultad de Ciencias Astronómicas y Geofísicas',
    'Facultad de Cs. Agrarias y Forestales': 'Facultad de Ciencias Agrarias y Forestales',
    'Facultad de Trabajo': 'Facultad de Trabajo Social',
    'Facultad de Periodismo y Comunicación Social    ': 'Facultad de Periodismo y Comunicación Social',
    'Facultad de Humanidades y Cs. de la Educación  ': 'Facultad de Humanidades y Ciencias de la Educación',
    'Facultad de Cs. Veterinarias': 'Facultad de Ciencias Veterinarias',
    'Facultad de Cs. Naturales y': 'Facultad de Ciencias Naturales y Museo',
    'Facultad de Cs. Jurídicas y Sociales  ': 'Facultad de Ciencias Jurídicas y Sociales',
    'Facultad de Cs.': 'Facultad de Ciencias Económicas',
    'Facultad de Cs. Económicas    ': 'Facultad de Ciencias Económicas',
    'Facultad de Cs. Astronómicas y Geofísicas    ': 'Facultad de Ciencias Astronómicas y Geofísicas',
    'Facultad de Cs. Agrarias y': 'Facultad de Ciencias Agrarias y Forestales',
    'Facultad de Bellas': 'Facultad de Bellas Artes',
    'Facultad de Arquitectura y Urbanismo      ': 'Facultad de Arquitectura y Urbanismo',
    'Facultad de Ciencias Naturales y Museo (FINALES': 'Facultad de Ciencias Naturales y Museo',
    'Facultad de Trabajo Social': 'Facultad de Trabajo Social',
    'Facultad de Psicología': 'Facultad de Psicología',
    'Facultad de Periodismo y Comunicación Social': 'Facultad de Periodismo y Comunicación Social',
    'Facultad de Odontología': 'Facultad de Odontología',
    'Facultad de Ingeniería': 'Facultad de Ingeniería',
    'Facultad de Informática': 'Facultad de Informática',
    'Facultad de Humanidades y Ciencias de la Educación': 'Facultad de Humanidades y Ciencias de la Educación',
    'Facultad de Ciencias Veterinarias': 'Facultad de Ciencias Veterinarias',
    'Facultad de Ciencias Naturales y Museo': 'Facultad de Ciencias Naturales y Museo',
    'Facultad de Ciencias Médicas': 'Facultad de Ciencias Médicas',
    'Facultad de Ciencias Jurídicas y Sociales': 'Facultad de Ciencias Jurídicas y Sociales',
    'Facultad de Ciencias Exactas': 'Facultad de Ciencias Exactas',
    'Facultad de Ciencias Económicas': 'Facultad de Ciencias Económicas',
    'Facultad de Ciencias Astronómicas y Geofísicas': 'Facultad de Ciencias Astronómicas y Geofísicas',
    'Facultad de Ciencias Agrarias y Forestales': 'Facultad de Ciencias Agrarias y Forestales',
    'Facultad de Bellas Artes': 'Facultad de Bellas Artes',
    'Facultad de Arquitectura y Urbanismo': 'Facultad de Arquitectura y Urbanismo',
    'Facultad de Arquitectura y Urbanismo \xa0 \xa0 \xa0': 'Facultad de Arquitectura y Urbanismo',
    'Facultad de Cs. Astronómicas y Geofísicas \xa0 \xa0': 'Facultad de Ciencias Astronómicas y Geofísicas',
    'Facultad de Cs. Económicas \xa0 \xa0': 'Facultad de Ciencias Económicas',
    'Facultad de Cs. Jurídicas y Sociales \xa0': 'Facultad de Ciencias Jurídicas y Sociales',
    'Facultad de Humanidades y Cs. de la Educación \xa0': 'Facultad de Humanidades y Ciencias de la Educación',
    'Facultad de Periodismo y Comunicación Social \xa0 \xa0': 'Facultad de Periodismo y Comunicación Social',
}


UNIVERSITY_GROUP = {
    'Franja Morada (Lista 3)': 'Franja Morada',
    '4 Franja Morada': 'Franja Morada',
    'La Fuente (JUP)': 'La Fuente',
    '17 La Fuente + Megafón': 'La Fuente',
    '8 La Fuente': 'La Fuente',
    'La fuente': 'La Fuente',
    '133 Franja Morada': 'Franja Morada',
    '3 Franja Morada + Indep.': 'Franja Morada',
    '3 Franja Morada': 'Franja Morada',
    'Franja morada': 'Franja Morada',
    '1163Franja Morada': 'Franja Morada',
    'Franja Morada': 'Franja Morada',
    'La fuente + Megafón': 'La Fuente',
    'La Fuente': 'La Fuente',
    'Informática verde': 'Informática Verde',
    '10 Informáticos Verde': 'Informática Verde',
    'Informática Verde': 'Informática Verde',
    'La Tercera posición': 'La Tercera Posición',
    '3 La Tercera Posición': 'La Tercera Posición',
    'La Tercera Posición': 'La Tercera Posición',
    'La tercera Posición': 'La Tercera Posición',
    'BLancos': 'Blanco',
    'Blanco/Nulos': 'Blanco',
    'En Blanco': 'Blanco',
    'Blanco': 'Blanco',
    'Blancos': 'Blanco',
}


class PollImporter:

    def __init__(self, *args, **kwargs):
        self.urls = kwargs['urls']

    # Get a BeautifulSoup object ready to scrap
    def get_data(self, url):
        main_page = requests.get(url)
        data = main_page.text
        return BeautifulSoup(data, 'html.parser'), main_page.status_code

    def import_polls(self):
        for url in self.urls:
            self.import_poll_url(url.get('name'), url.get('year'))

    def persist_year(self, year):
        poll_year, created = PollYear.objects.get_or_create(year=year)
        return poll_year

    def import_poll_url(self, url, year):
        #  Given an URL of a poll, imports the data
        scrap_detail, status = self.get_data(url)

        poll_year = self.persist_year(year)

        polls_table = scrap_detail.find("div", class_="body").find_all("table")

        del polls_table[0]  # Remove first table (Referencias)

        for poll_html in polls_table:
            self.import_poll(poll_html, poll_year)

    def import_poll(self, poll_html, poll_year):
        votes = poll_html.find_all("tr")

        university_school = self.import_university_school(votes[0])

        del votes[0]  # Remove first tr (Facultad)
        del votes[0]  # Remove second tr (Columnas)
        votes = votes[:-1]  # Remove last tr (TOTAL)

        for vote in votes:
            vote_row = vote.find_all("p")

            try:
                university_group = self.import_university_group(vote_row[0])
            except Exception:
                tds_html = vote.find_all("td")
                university_group = self.import_university_group(tds_html[0])

            try:
                cloister_votes = vote_row[1].text.strip()
                center_votes = vote_row[2].text.strip()
            except Exception:
                tds_html = vote.find_all("td")
                cloister_votes = tds_html[1].text.strip()
                center_votes = tds_html[2].text.strip()

            cloister_votes = cloister_votes if cloister_votes else 0
            center_votes = center_votes if center_votes else 0

            cloister_votes = cloister_votes if not cloister_votes == '-' else 0
            center_votes = center_votes if not center_votes == '-' else 0

            print("Claustro -> {0}, Centro -> {1}, Año: {2}".format(
                cloister_votes,
                center_votes,
                poll_year.year
            ))

            self.persist_poll(
                poll_year, center_votes,
                cloister_votes, university_group,
                university_school
            )

    def import_university_group(self, university_html):
        name = university_html.text.strip()

        name_splitted = name.split(' ')

        if len(name_splitted) > 2:
            if name_splitted[0] == 'Lista':
                del name_splitted[0]  # Remove first word (LISTA)
                del name_splitted[0]  # Remove second word (number of LISTA)
            elif name_splitted[0] == '1163Franja Morada':
                name_splitted[0] = 'Franja Morada'

        name_ok = " ".join(name_splitted)

        print("Agrupación: {}".format(name_ok))

        return self.persist_university_group(name_ok)

    def import_university_school(self, university_html):
        name = university_html.find("strong").text.strip()

        name_splitted = name.split(' ')

        if len(name_splitted) > 3:
            name_splitted = name_splitted[:-1]  # Remove last word (FINAL)

        name_ok = " ".join(name_splitted)

        print("Facultad: {}".format(name_ok))

        return self.persist_university_school(name_ok)

    def persist_university_school(self, name):
        normalized_name = UNIVERSITY_SCHOOL[name]
        university, created = UniversitySchool.objects.get_or_create(name=normalized_name)
        return university

    def persist_university_group(self, name):
        try:
            normalized_name = UNIVERSITY_GROUP[name]
        except Exception:
            normalized_name = name

        university, created = UniversityGroup.objects.get_or_create(name=normalized_name)
        return university

    def persist_poll(
        self, year, center_votes,
        cloister_votes, university_group,
        university_school
    ):
        try:
            poll, created = Poll.objects.get_or_create(
                cloister_votes=cloister_votes,
                center_votes=center_votes,
                university_school=university_school,
                university_group=university_group,
                year=year
            )
        except IntegrityError:
            # Movie exists
            return Poll.objects.get(
                year=year,
                university_school=university_school,
                university_group=university_group
            )
        except Exception as e:
            print("Error persisting Poll: {}".format(str(e)))
            return None
        return poll
