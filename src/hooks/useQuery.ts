import { useLocation } from 'umi';
export default function useQuery(): Record<string, string> {
  const location: any = useLocation();
  return location.query;
}
