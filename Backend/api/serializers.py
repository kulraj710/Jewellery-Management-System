from rest_framework import serializers

from .models import Product, ProductCategory, ProductMaterial, ProductSupplier, ProductUsers

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'

class ProductUsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductUsers
        fields = '__all__'

class ProductSupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSupplier
        fields = '__all__'

class ProductMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMaterial
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer()
    material_type = ProductMaterialSerializer()
    supplier = ProductSupplierSerializer(allow_null=True)
    entered_by = ProductUsersSerializer()

    class Meta:
        model = Product
        fields = '__all__'
