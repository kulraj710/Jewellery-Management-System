from django.db import models


class Product(models.Model):
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    brand = models.CharField(max_length=255, null=True, blank=True)
    material_type = models.CharField(max_length=255, null=True, blank=True)
    purity = models.CharField(max_length=255, null=True, blank=True)
    grweight = models.CharField(max_length=255)
    ntweight = models.CharField(max_length=255)
    gemstones = models.CharField(max_length=255, blank=True, null=True)
    design_type = models.CharField(max_length=255, null=True, blank=True)
    size = models.CharField(max_length=255, null=True, blank=True)
    customizable = models.BooleanField(default=False)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    stock_quantity = models.IntegerField()
    supplier = models.CharField(max_length=255, null=True, blank=True)
    product_image = models.ImageField(upload_to='product_images/', null=True)
    product_video = models.URLField(blank=True, null=True)
    certification_details = models.TextField(blank=True, null=True)
    warranty = models.BooleanField(default=False)
    care_instructions = models.TextField(blank=True, null=True)
    product_tags = models.CharField(max_length=255, blank=True, null=True)
    date_of_entry = models.DateField()
    entered_by = models.CharField(max_length=255)
    product_status = models.CharField(max_length=50, default='Active')

    def __str__(self):
        return self.product_name

