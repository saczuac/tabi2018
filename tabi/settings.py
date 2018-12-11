import os
import sys

import django_heroku


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = '&9+&&*=^-@g-o688b08fo@rbdytey8q2n5-r&e48^r2ofbot-@'

DEBUG = True

ALLOWED_HOSTS = []

LOGIN_URL = 'login'

LOGIN_REDIRECT_URL = 'stats'


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party libs
    'rest_framework',
    'rest_framework_swagger',
    'django_filters',

    # self apps
    'poll',
    'university',
    'frontend',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'tabi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tabi.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
    'info_db': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'info_db.sqlite3'),
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

STATIC_ROOT = './static_root'

STATIC_URL = '/static/'

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
}

DATABASE_ROUTERS = ['tabi.db_router.PollRouter', ]


SCRAPING_URLS = [
    {
        "name": "https://unlp.edu.ar/elecciones/eleccionesunlp-los-estudiantes-eligen-a-sus-representantes-8632",
        "year": 2017
    },
    {
        "name": "https://unlp.edu.ar/elecciones/resultado-de-la-eleccion-del-claustro-de-estudiantes-2018-11036",
        "year": 2018
    },
    {
        "name": "https://unlp.edu.ar/elecciones/elecciones_estudiantiles_2016_resultados-3991",
        "year": 2016
    },
    {
        "name": "https://unlp.edu.ar/elecciones/elecciones_estudiantiles_2015_resultados-3989",
        "year": 2015
    },
    {
        "name": "https://unlp.edu.ar/elecciones/elecciones_estudiantiles_2014-3987",
        "year": 2014
    },
    {
        "name": "https://unlp.edu.ar/elecciones/elecciones_estudiantiles_2013-3986",
        "year": 2013
    },
    {
        "name": "https://unlp.edu.ar/elecciones/elecciones_estudiantiles_2012-3984",
        "year": 2012
    }
]

django_heroku.settings(locals(), databases=False)


try:
    from tabi.local_settings import *
except ImportError:
    pass

if 'test' in sys.argv:
    try:
        from tabi.test_settings import *
    except ImportError:
        pass
