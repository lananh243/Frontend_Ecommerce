import { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, Button, Modal, TextInput, Alert } from "react-native"
import { ChevronDown } from "lucide-react-native"
import { useLocalSearchParams } from "expo-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { comment, getAllComment } from "@/services/comment"

export default function ReviewsSection() {
  const [reviewsOpen, setReviewsOpen] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams();

  // Lấy tất cả comment
  const { data: reviewsData, isLoading, refetch } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => getAllComment(Number(id))
  })


  // API gui review
  const { mutate: addComment, isPending } = useMutation({
    mutationFn: comment,
    onSuccess: (res) => {
      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!")
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      setModalVisible(false)
      setReviewText("")
      setRating(0)
    },
    onError: (err: any) => {
      Alert.alert("Lỗi", err?.response?.data?.message || "Không thể gửi đánh giá")
    },
  })

  const handleSubmitReview = () => {
    if (!reviewText.trim() || rating === 0) {
      Alert.alert("Thông báo", "Vui lòng nhập nội dung và chọn số sao.")
      return
    }

    addComment({
      productId: Number(id),
      rating,
      comment: reviewText,
    })
  }

  {/* Tính toán từ reviewsData */ }
  const totalReviews = reviewsData?.data?.length || 0;
  const totalStars = reviewsData?.data?.reduce((sum: number, review: any) => sum + review.rating, 0) || 0;
  const averageRating = totalReviews ? (totalStars / totalReviews).toFixed(1) : "0";

  // Tính phần trăm cho mỗi mức sao
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviewsData?.data?.filter((r: any) => r.rating === star).length || 0;
    const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
    return { stars: star, count, percentage };
  })

  const ratingData = [
    { stars: 5, percentage: 80, count: 42 },
    { stars: 4, percentage: 12, count: 8 },
    { stars: 3, percentage: 5, count: 3 },
    { stars: 2, percentage: 3, count: 2 },
    { stars: 1, percentage: 0, count: 0 },
  ]

  const reviews = [
    {
      id: 1,
      author: "Jennifer Rose",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
      rating: 5,
      timeAgo: "5m ago",
      text: "I love it. Awesome customer service! Helped me out with posting on additional send. Thanks again!",
    },
    {
      id: 2,
      author: "Kelly Rihana",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      rating: 5,
      timeAgo: "3m ago",
      text: "I'm very happy with order. It was delivered on and good quality. Recommended!",
    },
  ]

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setReviewsOpen(!reviewsOpen)} style={styles.header}>
        <Text style={styles.headerTitle}>Reviews</Text>
        <ChevronDown
          size={16}
          color="#000"
          style={{
            transform: reviewsOpen ? [{ rotate: "180deg" }] : [{ rotate: "0deg" }],
          }}
        />
      </TouchableOpacity>

      {reviewsOpen && (
        <>
          {/* Rating Summary */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingHeader}>
              {/* Overall Rating */}
              <View style={styles.ratingScore}>
                <Text style={styles.ratingNumber}>{averageRating}</Text>
                <Text style={styles.ratingLabel}>OUT OF 5</Text>
              </View>

              {/* Stars and review count */}
              <View style={styles.starsRow}>
                {[...Array(Math.round(Number(averageRating)))].map((_, i) => (
                  <Text key={i} style={styles.star}>★</Text>
                ))}
                <Text style={styles.ratingCount}>{totalReviews} ratings</Text>
              </View>
            </View>

            {/* Rating Distribution */}
            <View style={styles.distributionContainer}>
              {ratingDistribution.map((item) => (
                <View key={item.stars} style={styles.distributionRow}>
                  <View style={styles.starLabel}>
                    <Text style={styles.star}>★</Text>
                    <Text>{item.stars}</Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { width: `${item.percentage}%` }]} />
                  </View>
                  <Text style={styles.percentage}>{item.percentage}%</Text>
                </View>
              ))}
            </View>

            {/* Write Review Button */}
            <View style={styles.reviewActions}>
              <Text style={styles.reviewCount}>{reviewsData?.data?.length || 0} Reviews</Text>
              <TouchableOpacity style={styles.writeReview} onPress={() => setModalVisible(true)}>
                <Text style={styles.writeReviewText}>✎ WRITE A REVIEW</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reviews List */}
          <View style={styles.reviewsList}>
            {reviewsData?.data?.map((review: any) => (
              <View key={review.reviewId} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
                  <View style={styles.reviewContent}>
                    <View style={styles.reviewTitle}>
                      <Text style={styles.reviewAuthor}>{review.userName}</Text>
                      <Text style={styles.reviewTime}>{new Date(review.createdAt).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.reviewRating}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Text key={i} style={styles.star}>
                          ★
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
      {/* Modal nhập bình luận */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            {/* Rating stars */}
            <View style={styles.starSelectContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Text style={[styles.starIcon, { color: star <= rating ? "#FFD700" : "#CCCCCC" }]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Review input */}
            <TextInput
              style={styles.modalInput}
              placeholder="Write your review here..."
              multiline
              value={reviewText}
              onChangeText={setReviewText}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
              <Button title={isPending ? "Submitting..." : "Submit"} onPress={handleSubmitReview} />
            </View>
          </View>
        </View>
      </Modal>

    </View>


  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  ratingSection: {
    paddingVertical: 24,
    gap: 16,
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingRow: {
    flexDirection: "row",
    gap: 16,
  },
  ratingScore: {
    alignItems: "center",
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: "bold",
  },
  ratingLabel: {
    fontSize: 12,
    color: "#999999",
  },
  distributionContainer: {
    flex: 1,
    gap: 8,
  },
  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 32,
    fontSize: 12,
  },
  star: {
    color: "#4CAF50",
    fontSize: 14,
  },
  barContainer: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    height: 6,
    overflow: "hidden",
  },
  bar: {
    backgroundColor: "#4CAF50",
    height: "100%",
    borderRadius: 4,
  },
  percentage: {
    width: 32,
    fontSize: 12,
    color: "#999999",
    textAlign: "right",
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
    alignItems: "center",
    marginBottom: 8,
  },
  ratingCount: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 8,
  },
  reviewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  reviewCount: {
    fontSize: 12,
    color: "#999999",
  },
  writeReview: {
    backgroundColor: "transparent",
  },
  writeReviewText: {
    color: "#0A5FCC",
    fontSize: 12,
    fontWeight: "600",
  },
  reviewsList: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 24,
    gap: 24,
  },
  reviewItem: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  reviewHeader: {
    flexDirection: "row",
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  reviewAuthor: {
    fontWeight: "600",
    fontSize: 14,
  },
  reviewTime: {
    fontSize: 12,
    color: "#999999",
  },
  reviewRating: {
    flexDirection: "row",
    gap: 2,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 21,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "85%",
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 100,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  starSelectContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  starIcon: {
    fontSize: 28,
    marginHorizontal: 4,
  },

})
