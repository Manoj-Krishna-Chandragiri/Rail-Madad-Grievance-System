from django.urls import path
from .views import file_complaint, user_complaints, complaint_detail, complaint_list

urlpatterns = [
    path('file/', file_complaint, name='file_complaint'),
    path('list/', complaint_list, name='complaint_list'),
    path('user/', user_complaints, name='user_complaints'),
    path('<int:complaint_id>/', complaint_detail, name='complaint_detail'),
]