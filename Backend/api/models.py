from django.db import models


class Product(models.Model):
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    description = models.TextField()
    brand = models.CharField(max_length=255)
    material_type = models.CharField(max_length=255)
    purity = models.CharField(max_length=255)
    weight = models.CharField(max_length=255)
    gemstones = models.CharField(max_length=255, blank=True, null=True)
    design_type = models.CharField(max_length=255)
    size = models.CharField(max_length=255)
    customizable = models.BooleanField(default=False)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    stock_quantity = models.IntegerField()
    supplier = models.CharField(max_length=255)
    product_images = models.JSONField(default=list, blank=True, null=True)  # Assuming storing image URLs
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

