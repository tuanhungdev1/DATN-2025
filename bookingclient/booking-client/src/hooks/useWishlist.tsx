/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import {
  useAddToWishlistMutation,
  useRemoveByHomestayMutation,
  useIsInWishlistQuery,
} from "@/services/endpoints/wishlist.api";

export const useWishlist = (homestayId?: number) => {
  const toast = useToast();
  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveByHomestayMutation();

  // Check if homestay is in wishlist
  const { data: isInWishlistData } = useIsInWishlistQuery(homestayId!, {
    skip: !homestayId,
  });

  const isInWishlist = isInWishlistData?.data || false;

  const toggleWishlist = useCallback(
    async (id: number) => {
      try {
        if (isInWishlist) {
          // Remove from wishlist
          const result = await removeFromWishlist(id).unwrap();
          if (result.success) {
            toast.success("Đã xóa khỏi danh sách yêu thích");
          }
        } else {
          // Add to wishlist
          const result = await addToWishlist({ homestayId: id }).unwrap();
          if (result.success) {
            toast.success("Đã thêm vào danh sách yêu thích");
          }
        }
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
        toast.error(errorMessage);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist, toast]
  );

  return {
    isInWishlist,
    toggleWishlist,
    isLoading: isAdding || isRemoving,
  };
};
