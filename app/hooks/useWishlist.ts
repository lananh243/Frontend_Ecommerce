import { addToWishList, deleteWishlist, getWishlist } from '@/services/wishlist';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { Alert } from 'react-native';

export function useWishlist() {
    const queryClient = useQueryClient();

    const { data: wishlist = [] } = useQuery({
        queryKey: ["wishlist"],
        queryFn: getWishlist,
    });

    const addMutation = useMutation({
        mutationFn: (id: number) => addToWishList(id),
        onSuccess: () => {
            Alert.alert("Thành công", "Đã thêm sản phẩm vào wishlist 💖");
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
        onError: () => {
            Alert.alert("Lỗi", "Không thể thêm vào wishlist, vui lòng thử lại.");
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: number) => deleteWishlist(id),
        onSuccess: () => {
            Alert.alert("Đã xóa", "Đã xóa sản phẩm khỏi wishlist 💔");
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
        onError: () => {
            Alert.alert("Lỗi", "Không thể xóa khỏi wishlist.");
        },
    });

    return {
        wishlist,
        addToWishlist: addMutation.mutate,
        removeFromWishlist: removeMutation.mutate,
        isAdding: addMutation.isPending,
        isRemoving: removeMutation.isPending,
    }
}
