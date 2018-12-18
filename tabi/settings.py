import os
import sys

from decouple import config

import django_heroku


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = config('SECRET_KEY')

DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'd85mhjf0hjl8qk',
        'USER': 'hfipuaemxpgtdv',
        'PASSWORD': '6011e5733717e3c33f4e60eae0d05c107c2097e806db8816647093b87e33082f',
        'HOST': 'ec2-54-221-202-191.compute-1.amazonaws.com',
        'PORT': '5432',
    },
    'info_db': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'd4bv18geg5dopp',
        'USER': 'ahgvobvhyysteh',
        'PASSWORD': '70de73aa790d2d6aee6503c24e4b0b26dd94ca9e297870ab9ec89fc18d28aac1',
        'HOST': 'ec2-54-243-150-10.compute-1.amazonaws.com',
        'PORT': '5432',
    }
}

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

django_heroku.settings(locals())


def get_cache():
    import os
    try:
        servers = os.environ['MEMCACHIER_SERVERS']
        username = os.environ['MEMCACHIER_USERNAME']
        password = os.environ['MEMCACHIER_PASSWORD']

        return {
            'default': {
                'BACKEND': 'django.core.cache.backends.memcached.PyLibMCCache',
                # TIMEOUT is not the connection timeout! It's the default expiration
                # timeout that should be applied to keys! Setting it to `None`
                # disables expiration.
                'TIMEOUT': None,
                'LOCATION': servers,
                'OPTIONS': {
                    'binary': True,
                    'username': username,
                    'password': password,
                    'behaviors': {
                        # Enable faster IO
                        'no_block': True,
                        'tcp_nodelay': True,
                        # Keep connection alive
                        'tcp_keepalive': True,
                        # Timeout settings
                        'connect_timeout': 2000, # ms
                        'send_timeout': 750 * 1000, # us
                        'receive_timeout': 750 * 1000, # us
                        '_poll_timeout': 2000, # ms
                        # Better failover
                        'ketama': True,
                        'remove_failed': 1,
                        'retry_timeout': 2,
                        'dead_timeout': 30,
                    }
                }
            }
        }
    except:
        return {
            'default': {
                'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
            }
        }

CACHES = get_cache()


try:
    from tabi.local_settings import *
except ImportError:
    pass

if 'test' in sys.argv:
    try:
        from tabi.test_settings import *
    except ImportError:
        pass
