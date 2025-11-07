import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductDetailScreen = () => {
  const colors = ['#C8A79C', '#7D5A50', '#E7D2C8'];
  const sizes = ['S', 'M', 'L'];
  const reviews = [
    { id: 1, name: 'Jennifer Rose', text: 'I like it, awesome sportwear set and nice quality.', rating: 5 },
    { id: 2, name: 'Kelly Rivera', text: 'Fits nicely, soft fabric and great design!', rating: 5 },
  ];
  const similarProducts = [
    { id: 1, name: 'Relax Crop Hoodie', price: '$43.00', image: 'https://i.imgur.com/YbXzC5H.png' },
    { id: 2, name: 'Gym Crop Top', price: '$39.99', image: 'https://i.imgur.com/X9jVtJd.png' },
    { id: 3, name: 'Sport Tank', price: '$47.99', image: 'https://i.imgur.com/jj2E8Lo.png' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/BwFz7HC.png' }}
            style={styles.image}
          />
          <TouchableOpacity style={styles.heartIcon}>
            <Ionicons name="heart-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Sportwear Set</Text>
          <Text style={styles.price}>$80.00</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" color="#FFD700" size={18} />
            <Text style={styles.ratingText}>4.9 (256 reviews)</Text>
          </View>

          {/* Color Selection */}
          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorRow}>
            {colors.map((c, i) => (
              <TouchableOpacity key={i} style={[styles.colorCircle, { backgroundColor: c }]} />
            ))}
          </View>

          {/* Size Selection */}
          <Text style={styles.sectionLabel}>Size</Text>
          <View style={styles.sizeRow}>
            {sizes.map((s, i) => (
              <TouchableOpacity key={i} style={styles.sizeButton}>
                <Text style={styles.sizeText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>
            Sportwear is no longer under culture. It is no longer tied to athletic tradition
            but comes with social fashion identity. This set is combined in fit and style.
          </Text>

          {/* Reviews */}
          <Text style={styles.sectionLabel}>Reviews</Text>
          <View style={styles.reviewBox}>
            {reviews.map(r => (
              <View key={r.id} style={styles.reviewItem}>
                <Text style={styles.reviewer}>{r.name}</Text>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>

          {/* Similar Products */}
          <Text style={styles.sectionLabel}>Similar Products</Text>
          <FlatList
            horizontal
            data={similarProducts}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.similarCard}>
                <Image source={{ uri: item.image }} style={styles.similarImage} />
                <Text style={styles.similarName}>{item.name}</Text>
                <Text style={styles.similarPrice}>{item.price}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Add To Cart Button */}
      <TouchableOpacity style={styles.addToCartBtn}>
        <Text style={styles.addToCartText}>Add To Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  imageContainer: { alignItems: 'center', marginTop: 10 },
  image: { width: 250, height: 300, resizeMode: 'contain' },
  heartIcon: { position: 'absolute', right: 20, top: 10, backgroundColor: '#fff', borderRadius: 20, padding: 6 },
  infoContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  title: { fontSize: 22, fontWeight: '700', color: '#222' },
  price: { fontSize: 20, color: '#222', marginVertical: 5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  ratingText: { marginLeft: 5, color: '#555' },
  sectionLabel: { fontSize: 16, fontWeight: '600', marginTop: 15, marginBottom: 5 },
  colorRow: { flexDirection: 'row', gap: 10 },
  colorCircle: { width: 26, height: 26, borderRadius: 13 },
  sizeRow: { flexDirection: 'row', gap: 10 },
  sizeButton: { borderWidth: 1, borderColor: '#ccc', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 10 },
  sizeText: { fontSize: 14 },
  description: { color: '#666', lineHeight: 20 },
  reviewBox: { marginTop: 10 },
  reviewItem: { marginBottom: 10 },
  reviewer: { fontWeight: '600', color: '#222' },
  reviewText: { color: '#555' },
  similarCard: { marginRight: 15, width: 120 },
  similarImage: { width: 120, height: 130, borderRadius: 10 },
  similarName: { fontSize: 14, fontWeight: '500', marginTop: 5 },
  similarPrice: { color: '#666', fontSize: 13 },
  addToCartBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    paddingVertical: 15,
    alignItems: 'center',
  },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
