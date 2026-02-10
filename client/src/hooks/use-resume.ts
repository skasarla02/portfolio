import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useResume() {
  return useQuery({
    queryKey: [api.resume.get.path],
    queryFn: async () => {
      const res = await fetch(api.resume.get.path);
      if (!res.ok) throw new Error("Failed to fetch resume");
      return api.resume.get.responses[200].parse(await res.json());
    },
  });
}
