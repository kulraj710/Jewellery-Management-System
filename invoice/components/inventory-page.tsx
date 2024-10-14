'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for demonstration
const products = [
  { id: 1, name: "Diamond Ring", type: "Ring", material: "Gold", price: 1999, stock: 15, image: "public/placeholder.svg" },
  { id: 2, name: "Pearl Necklace", type: "Necklace", material: "Silver", price: 599, stock: 8, image: "public/placeholder.svg" },
  { id: 3, name: "Sapphire Earrings", type: "Earrings", material: "White Gold", price: 799, stock: 12, image: "public/placeholder.svg" },
  { id: 4, name: "Gold Bracelet", type: "Bracelet", material: "Gold", price: 1299, stock: 20, image: "public/placeholder.svg" },
  // Add more mock products as needed
]

export function InventoryPageComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterMaterial, setFilterMaterial] = useState("")

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === "" || product.type === filterType) &&
    (filterMaterial === "" || product.material === filterMaterial)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory (Not functional yet)</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Ring">Rings</SelectItem>
              <SelectItem value="Necklace">Necklaces</SelectItem>
              <SelectItem value="Earrings">Earrings</SelectItem>
              <SelectItem value="Bracelet">Bracelets</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterMaterial} onValueChange={setFilterMaterial}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Materials</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="White Gold">White Gold</SelectItem>
              <SelectItem value="Platinum">Platinum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.type} - {product.material}</p>
              <p className="text-lg font-bold">${product.price}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4">
              <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}