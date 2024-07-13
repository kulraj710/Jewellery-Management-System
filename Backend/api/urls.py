from django.urls import path
from .views import ProductListCreateView, ProductDetailView, generate_label, ProductCategoryListView, ProductMaterialTypeListView, ProductSupplierListView, ProductUsersListView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('product/add', ProductListCreateView.as_view(), name='add new product'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/generate-label/<int:product_id>/', generate_label, name='generate_label'),
    path('products/categories/', ProductCategoryListView.as_view(), name='product-category-list'),
    path('products/material-types/', ProductMaterialTypeListView.as_view(), name='product-material-type-list'),
    path('products/suppliers/', ProductSupplierListView.as_view(), name='product-supplier-list'),
    path('products/users/', ProductUsersListView.as_view(), name='product-users-list'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)