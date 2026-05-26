from django.contrib import admin

from .models import Department, Faculty


class DepartmentInline(admin.TabularInline):
    model = Department
    extra = 0


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('name', 'code')
    inlines = (DepartmentInline,)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'faculty', 'is_active', 'created_at')
    list_filter = ('faculty', 'is_active')
    search_fields = ('name', 'code', 'faculty__name')
