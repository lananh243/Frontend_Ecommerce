import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOrderByStatus } from "@/services/order";
import { router } from "expo-router";

const tabs = ["Pending", "Delivered", "Cancelled"];

export default function MyOrdersScreen() {
    const [activeTab, setActiveTab] = useState("Pending");
    const [userEmail, setUserEmail] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchUser = async () => {
            const userData = await AsyncStorage.getItem("userInfo");
            if (userData) {
                const user = JSON.parse(userData);
                setUserEmail(user.email);
            }
        };
        fetchUser();
    }, []);

    const { data: orders, isLoading, isError, refetch } = useQuery({
        queryKey: ["orders", activeTab, userEmail],
        queryFn: () =>
            getOrderByStatus(activeTab.toUpperCase(), userEmail || ""),
        enabled: !!userEmail,
    });


    const statusColors: Record<string, string> = {
        PENDING: "#FFC107",    // vàng
        DELIVERED: "#28a745",  // xanh lá
        CANCELLED: "#dc3545",  // đỏ
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back" size={22} color="black" onPress={() => router.back()} />
                </TouchableOpacity>
                <Text style={styles.title}>My Orders</Text>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={22} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[styles.tabText, activeTab === tab && styles.activeTabText]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Orders List */}
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : isError ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Error loading orders</Text>
                    <Text onPress={() => refetch()} style={{ color: "blue", marginTop: 8 }}>
                        Try again
                    </Text>
                </View>
            ) : orders && orders.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {orders.map((order: any) => (
                        <View key={order.orderId} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.orderId}>Order #{order.orderId}</Text>
                                <Text style={styles.date}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </Text>
                            </View>

                            {/* Order Items */}
                            <View style={styles.itemRow}>
                                <Text style={styles.itemQty}>Total Quantity: {order.orderItems.reduce((sum: any, i: any) => sum + i.quantity, 0)}</Text>
                            </View>

                            <View style={styles.summaryRow}>
                                <Text style={styles.label}>Subtotal:</Text>
                                <Text style={styles.value}>
                                    {Number(order.subtotal).toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </Text>
                            </View>

                            <View style={styles.bottomRow}>
                                <Text style={[styles.status, { color: statusColors[order.orderStatus] || "#000" }]}>
                                    {order?.orderStatus}
                                </Text>

                                <TouchableOpacity style={styles.detailsButton}
                                    onPress={() =>
                                        router.push({ pathname: "/order/[id]", params: { id: order.orderId.toString() } })
                                    }>
                                    <Text style={styles.detailsText}>Details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "red" }}>No orders found.</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
    header: { marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    title: { fontSize: 18, fontWeight: "600" },
    tabs: { flexDirection: "row", justifyContent: "space-around", marginVertical: 20 },
    tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
    tabText: { color: "#999", fontWeight: "500" },
    activeTab: { backgroundColor: "#000" },
    activeTabText: { color: "#fff" },
    card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 2 },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    orderId: { fontWeight: "700", fontSize: 15 },
    date: { color: "#999", fontSize: 12 },
    itemRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 2 },
    itemName: { color: "#000", fontWeight: "500", flex: 1 },
    itemQty: { color: "#555" },
    itemPrice: { color: "#000", fontWeight: "500" },
    summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
    label: { color: "#555" },
    value: { color: "#000" },
    bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
    status: { color: "#28a745", fontWeight: "600", fontSize: 13 },
    detailsButton: { borderWidth: 1, borderColor: "#000", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 16 },
    detailsText: { color: "#000", fontWeight: "500" },
});
