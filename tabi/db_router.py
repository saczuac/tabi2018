from university.models import University, UniversityGroupBlock


class PollRouter:
    """
    A router to control all database operations on models in the
    poll application.
    """
    def db_for_read(self, model, **hints):
        if model == UniversityGroupBlock or model == University:
            return 'info_db'
        return 'default'

    def db_for_write(self, model, **hints):
        if model == UniversityGroupBlock or model == University:
            return 'info_db'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        return 'default'

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        return 'default'
