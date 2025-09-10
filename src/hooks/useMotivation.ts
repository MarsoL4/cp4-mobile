import { useQuery } from "@tanstack/react-query";

async function fetchMotivation(): Promise<string> {
  const resp = await fetch("https://api.quotable.io/random?tags=motivational");
  const data = await resp.json();
  return data.content;
}

export function useMotivation() {
  return useQuery({
    queryKey: ["motivation"],
    queryFn: fetchMotivation
  });
}