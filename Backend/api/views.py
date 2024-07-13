from django.http import Http404, HttpResponse
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from reportlab.lib.pagesizes import inch, A4
from reportlab.pdfgen import canvas

from .models import Product
from .serializers import ProductSerializer



class ProductListCreateView(APIView):

    def get(self, request, format=None):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


    def post(self, request, format=None):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):

    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        product = self.get_object(pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        product = self.get_object(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        


def generate_label(request, product_id):
    # Fetch product details from the database
    product = Product.objects.get(pk=product_id)

    # Create a response object and set content type to PDF
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="label_{product_id}.pdf"'

    # Create a PDF object
    # p = canvas.Canvas(response, pagesize=(3 * inch, 2 * inch))
    p = canvas.Canvas(response, pagesize=A4)

    # Draw the label content
    p.drawString(0.5 * inch, 1.5 * inch, f"Product Name: {product.product_name}")
    p.drawString(0.5 * inch, 1.25 * inch, f"Price: ${product.product_status}")
    p.drawString(0.5 * inch, 1.0 * inch, f"SKU: {product.product_code}")

    # Save the PDF
    p.showPage()
    p.save()

    print(response)
    return response


# def generate_label(request, product_id):
#     products = Product.objects.all()  # Fetch all products or a specific subset

#     response = HttpResponse(content_type='application/pdf')
#     response['Content-Disposition'] = 'attachment; filename="labels.pdf"'

#     p = canvas.Canvas(response, pagesize=A4)

#     # A4 dimensions in inches
#     width, height = A4

#     # Label dimensions
#     label_width = 3 * inch
#     label_height = 2 * inch

#     # Positions for 3x3 labels on A4
#     positions = [
#         (0, 0), (label_width, 0), (2 * label_width, 0),
#         (0, label_height), (label_width, label_height), (2 * label_width, label_height),
#         (0, 2 * label_height), (label_width, 2 * label_height), (2 * label_width, 2 * label_height)
#     ]

#     for idx, product in enumerate(products[:9]):  # Limit to 9 products
#         x, y = positions[idx]
#         y = height - y - label_height  # Convert to bottom-left origin

#         p.drawString(0.5 * inch, 1.5 * inch, f"Product Name: {product.product_name}")
#         p.drawString(0.5 * inch, 1.25 * inch, f"Price: ${product.product_status}")
#         p.drawString(0.5 * inch, 1.0 * inch, f"SKU: {product.product_code}")


#     p.showPage()
#     p.save()
#     print(response)
#     return response