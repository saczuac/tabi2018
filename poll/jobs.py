# -*- coding: utf-8 -*-
import requests

from .models import UniversitySchool, UniversityGroup, Poll

from django.db.utils import IntegrityError

from bs4 import BeautifulSoup


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

    def import_poll_url(self, url, year):
        #  Given an URL of a poll, imports the data
        scrap_detail, status = self.get_data(url)

        polls_table = scrap_detail.find("div", class_="body").find_all("table")

        del polls_table[0]  # Remove first table (Referencias)

        for poll_html in polls_table:
            self.import_poll(poll_html, year)

    def import_poll(self, poll_html, year):
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
                year
            ))

            self.persist_poll(
                year, center_votes,
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
        university, created = UniversitySchool.objects.get_or_create(name=name)
        return university

    def persist_university_group(self, name):
        university, created = UniversityGroup.objects.get_or_create(name=name)
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
        return poll
