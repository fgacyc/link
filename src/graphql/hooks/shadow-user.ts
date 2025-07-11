import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShadowUser } from "../server";
import type { CreateShadowUserResponse } from "@/types/graphql";

export const shadowUserQueries = {
  default: [{ scope: "shadow_user" }] as const,
};

// Mutation hooks
export const useCreateShadowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name?: string;
      cg?: string;
      dob?: string;
      role?: string;
      gender?: string;
      metadata?: string;
    }): Promise<CreateShadowUserResponse> => createShadowUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shadowUserQueries.default });
    },
  });
};
