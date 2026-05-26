import sys


def patch_django_context_copy():
    if sys.version_info < (3, 14):
        return

    from django.template.context import BaseContext

    def copy_context(self):
        duplicate = object.__new__(self.__class__)
        duplicate.__dict__.update(self.__dict__)
        duplicate.dicts = self.dicts[:]
        return duplicate

    BaseContext.__copy__ = copy_context
