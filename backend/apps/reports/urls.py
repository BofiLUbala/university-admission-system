from django.urls import path
from .views import AdminStatsView, ExportApplicationsExcelView

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('export/excel/', ExportApplicationsExcelView.as_view(), name='export_excel'),
]
