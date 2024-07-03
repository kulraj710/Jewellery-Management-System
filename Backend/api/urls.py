from django.urls import path
from .views import ProductListCreateView, ProductDetailView

urlpatterns = [
    path('product/add', ProductListCreateView.as_view(), name='add new product'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

]