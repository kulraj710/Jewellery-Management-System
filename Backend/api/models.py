from django.db import models



class ProductCategory(models.Model):
    category_name = models.CharField(max_length=255)
    
class ProductUsers(models.Model):
    username = models.CharField(max_length=255)

class ProductSupplier(models.Model):
    partner_name = models.CharField(max_length=255)
    
class ProductMaterial(models.Model):
    material_type = models.CharField(max_length=20)
    
class Product(models.Model):
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=255)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    brand = models.CharField(max_length=255, null=True, blank=True)
    material_type = models.ForeignKey(ProductMaterial, on_delete=models.DO_NOTHING)
    purity = models.CharField(max_length=255, null=True, blank=True)
    grweight = models.CharField(max_length=255)
    ntweight = models.CharField(max_length=255)
    gemstones = models.CharField(max_length=255, blank=True, null=True)
    design_type = models.CharField(max_length=255, null=True, blank=True)
    size = models.CharField(max_length=255, null=True, blank=True)
    customizable = models.BooleanField(default=False)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.CharField(max_length=5, default="0")
    stock_quantity = models.IntegerField()
    supplier = models.ForeignKey(ProductSupplier,on_delete=models.DO_NOTHING, null=True, blank=True)
    product_image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    certification_details = models.TextField(blank=True, null=True)
    warranty = models.BooleanField(default=False)
    care_instructions = models.TextField(blank=True, null=True)
    product_tags = models.CharField(max_length=255, blank=True, null=True)
    date_of_entry = models.DateTimeField()
    entered_by = models.ForeignKey(ProductUsers, on_delete=models.DO_NOTHING)
    product_status = models.CharField(max_length=50, default='Active')

    def __str__(self):
        return self.product_name
