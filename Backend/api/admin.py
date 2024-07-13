from django.contrib import admin

from .models import Product, ProductCategory, ProductUsers, ProductSupplier, ProductMaterial

admin.site.register(Product)
admin.site.register(ProductCategory)
admin.site.register(ProductUsers)
admin.site.register(ProductSupplier)
admin.site.register(ProductMaterial)
