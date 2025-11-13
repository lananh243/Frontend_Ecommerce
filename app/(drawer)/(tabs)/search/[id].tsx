import ProductDetail from '@/components/ProductDetail'
import ReviewsSection from '@/components/ReviewsSection'
import SimilarProducts from '@/components/SimilarProducts'
import { detailProduct } from '@/services/product'
import { addToWishList } from '@/services/wishlist'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks'
import React, { use, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, View } from 'react-native'

export default function DetailProductScreen() {
  const param = useLocalSearchParams()
  const id = +param.id;

  const [selectedColor, setSelectedColor] = useState("default")
  const [selectedSize, setSelectedSize] = useState("default")

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => detailProduct(id),
  })
  console.log(product);
  

   if (isLoading || !product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ height: 4, backgroundColor: "#0A5FCC" }} />
      <ScrollView>
        <ProductDetail
          productId={id}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize}
        />
        <ReviewsSection />
        <SimilarProducts
          currentProductId={id}
          selectedColor={selectedColor}
          selectedSize={selectedSize} 
          categoryId={product.data?.categoryId}/>
      </ScrollView>
    </View>
  )
}
