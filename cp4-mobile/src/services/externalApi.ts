import { useQuery } from '@tanstack/react-query';

export function useMotivationalQuote() {
  return useQuery({
    queryKey: ['motivational-quote'],
    queryFn: async () => {
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) throw new Error('Failed to fetch quote');
      return response.json();
    },
  });
}