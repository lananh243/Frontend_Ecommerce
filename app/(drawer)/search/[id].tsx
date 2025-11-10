import ProductDetail from '@/components/ProductDetail'
import ReviewsSection from '@/components/ReviewsSection'
import SimilarProducts from '@/components/SimilarProducts'
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks'
import React, { use, useState } from 'react'
import { ScrollView, View } from 'react-native'

export default function DetailProductScreen() {
  const param = useLocalSearchParams()
  const id = +param.id;
  
  const [selectedColor, setSelectedColor] = useState("default")
  const [selectedSize, setSelectedSize] = useState("default")

  
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ height: 4, backgroundColor: "#0A5FCC" }} />
      <ScrollView>
        <ProductDetail 
          productId={id}
          onColorChange={setSelectedColor}
          onSizeChange={setSelectedSize} />
        <ReviewsSection />
        <SimilarProducts 
          currentProductId={id}
          selectedColor={selectedColor}
          selectedSize={selectedSize}/>
      </ScrollView>
    </View>
  )
}
