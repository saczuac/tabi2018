from django.views.generic import TemplateView

from django.contrib.auth.mixins import LoginRequiredMixin


class StatsView(LoginRequiredMixin, TemplateView):
    template_name = "stats.html"
