import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileSettingScreen() {
    const queryClient = useQueryClient();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<any>(null);

    // 🧩 Lấy thông tin user
    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    // 🧠 Gán dữ liệu user vào form
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
            setGender(user.gender || "");
            setPhoneNumber(user.phoneNumber || "");
            setAvatar(user.avatarUrl || null);
        }
    }, [user]);

    // 🖼️ Mở thư viện ảnh
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== "granted") {
            Alert.alert("Quyền bị từ chối", "Cần quyền truy cập thư viện ảnh để chọn ảnh đại diện.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const picked = result.assets[0];
            setAvatar(picked.uri);
            setAvatarFile({
                uri: picked.uri,
                type: picked.mimeType || "image/jpeg",
                name: picked.fileName || "avatar.jpg",
            });
        }
    };

    // ⚙️ Mutation gọi API cập nhật hồ sơ
    const mutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("email", email);
            formData.append("gender", gender);
            formData.append("phoneNumber", phoneNumber);
            if (avatarFile) {
                formData.append("avatar", avatarFile as any);
            }

            return updateProfile(formData);
        },
        onSuccess: async ({data}) => {
            // 🟢 Cập nhật cache React Query (Sidebar sẽ tự update)
    queryClient.setQueryData(["profile"], data);

    // 🟢 Cập nhật lại userInfo trong AsyncStorage
    await AsyncStorage.setItem("userInfo", JSON.stringify(data));

    Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
        },
        onError: (err: any) => {
            console.log(err);
            Alert.alert("Lỗi", err.response?.data?.message || "Cập nhật thất bại!");
        },
    });

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (isError || !user) {
        return (
            <View style={styles.center}>
                <Text>Không thể tải thông tin người dùng</Text>
                <TouchableOpacity onPress={() => refetch()}>
                    <Text style={{ color: "blue", marginTop: 10 }}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* 🔙 Back + Title */}
            <View style={styles.header}>
                <Ionicons name="chevron-back" size={24} color="#000" onPress={() => router.back()} />
                <Text style={styles.title}>Profile Setting</Text>
            </View>

            {/* 🧑 Avatar */}
            <View style={styles.avatarWrapper}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: avatar || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                        }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* 📝 Input fields */}
            <View style={styles.form}>
                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: "#f0f0f0", color: "#888" }]}
                        value={email}
                        editable={false}
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.row}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <TextInput style={styles.input} value={gender} onChangeText={setGender} />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>
            </View>

            {/* 💾 Save button */}
            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => mutation.mutate()}
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.saveButtonText}>Save change</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingVertical: 50,
        paddingHorizontal: 24,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 80,
    },
    avatarWrapper: {
        alignItems: "center",
        marginBottom: 30,
    },
    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#f5f5f5",
    },
    cameraButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#333",
        borderRadius: 20,
        padding: 6,
    },
    form: {
        width: "100%",
        marginTop: 60,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputContainer: {
        flex: 1,
        marginBottom: 20,
        marginRight: 12,
    },
    label: {
        fontSize: 12,
        color: "#B3B3B3",
        marginBottom: 4,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        fontSize: 14,
        color: "#000",
        paddingVertical: 6,
    },
    saveButton: {
        backgroundColor: "#333",
        borderRadius: 30,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 60,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
});
