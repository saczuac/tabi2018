from django.conf import settings

from django.core.management.base import BaseCommand

from poll.jobs import PollImporter


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('url', nargs='?', type=str)
        parser.add_argument('year', nargs='?', type=int)

    def handle(self, *args, **options):
        """Start the scrapping process."""
        if options['url'] and options['year']:
            PollImporter(urls=[
                {
                    "name": options['url'][0],
                    "year": options['year'][0],
                }
            ]).import_polls()
        elif settings.SCRAPING_URLS:
            PollImporter(urls=settings.SCRAPING_URLS).import_polls()
        else:
            print("You need to provide an URL to get the data!")
