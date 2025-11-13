import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { getOrderDetail } from "@/services/order";

const OrderDetailScreen = () => {
    const params = useLocalSearchParams();
    const orderId = Number(params.id);

    const { data: order, isLoading, isError, refetch } = useQuery({
        queryKey: ["orderDetail", orderId],
        queryFn: () => getOrderDetail(orderId),
        enabled: !!orderId,
    });

    const vnd = (amount: number) =>
        amount.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (isError || !order) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Error loading order</Text>
                <Text onPress={() => refetch()} style={{ color: "blue", marginTop: 8 }}>
                    Try again
                </Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Back Button + Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.orderId}>Order #1514</Text>
            </View>

            {/* Delivery Status */}
            {order.orderStatus === "DELIVERED" ? (
                <View style={styles.statusBox}>
                    <Ionicons name="cube-outline" size={40} color="#fff" />
                    <Text style={styles.statusText}>Your order is delivered</Text>
                    <Text style={styles.subStatusText}>Rate product to get 5 points for collect.</Text>
                </View>
            ) : order.orderStatus === "PENDING" ? (
                <View style={styles.statusBox}>
                    <Ionicons name="time-outline" size={40} color="#fff" />
                    <Text style={styles.statusText}>Your order is pending</Text>
                </View>
            ) : (
                <View style={styles.statusBox}>
                    <Ionicons name="close-outline" size={40} color="#fff" />
                    <Text style={styles.statusText}>Your order is cancelled</Text>
                </View>
            )}


            {/* Order Info */}
            <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Order number</Text>
                    <Text style={styles.infoValue}>#{order.orderId}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Delivery address</Text>
                    <Text style={styles.infoValue}>{order.state}</Text>
                </View>
            </View>

            <View style={styles.productBox}>
                {/* Product Items */}
                {order.orderItems.map((item: any) => (

                    <View key={item.orderItemId} style={styles.productRow}>
                        <Text style={styles.productName}>{item.productName}</Text>
                        <Text style={styles.productQty}>x{item.quantity}</Text>
                        <Text style={styles.productPrice}>{vnd(item.price)}</Text>
                    </View>

                ))}

                {/* Divider */}
                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Shipping</Text>
                    <Text style={styles.summaryValue}>{vnd(Number(order.shippingFee))}</Text>
                </View>
                <View style={styles.summaryRowTotal}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{vnd(order.subtotal)}</Text>
                </View>
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace("/")}>
                    <Text style={styles.secondaryButtonText}>Return home</Text>
                </TouchableOpacity>

                {order.orderStatus === "DELIVERED" && (
                    <TouchableOpacity style={styles.primaryButton}>
                        <Text style={styles.primaryButtonText}>Rate</Text>
                    </TouchableOpacity>
                )}

            </View>
        </ScrollView>
    );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
    },
    backButton: {
        marginRight: 10,
    },
    orderId: {
        fontSize: 18,
        fontWeight: "600",
        color: "#000",
        marginLeft: 80
    },
    statusBox: {
        backgroundColor: "#2E2E2E",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        marginBottom: 30,
    },
    statusText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
    },
    subStatusText: {
        color: "#E0E0E0",
        fontSize: 13,
        marginTop: 4,
    },
    infoBox: {
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 15,
        marginBottom: 50,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    infoLabel: {
        color: "#777",
        fontSize: 14,
    },
    infoValue: {
        color: "#000",
        fontSize: 14,
        fontWeight: "500",
    },
    productBox: {
        backgroundColor: "#F8F8F8",
        borderRadius: 12,
        padding: 15,
        marginBottom: 30,
    },
    productRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    productName: {
        flex: 1,
        color: "#000",
        fontSize: 14,
        fontWeight: "500",
    },
    productQty: {
        width: 30,
        textAlign: "center",
        color: "#000",
    },
    productPrice: {
        width: 80,
        textAlign: "right",
        color: "#000",
    },
    divider: {
        height: 1,
        backgroundColor: "#EAEAEA",
        marginVertical: 10,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    summaryRowTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    summaryLabel: {
        color: "#777",
    },
    summaryValue: {
        color: "#000",
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
    },
    totalValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 50,
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: "center",
        marginRight: 10,
    },
    secondaryButtonText: {
        color: "#000",
        fontWeight: "600",
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#000",
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
