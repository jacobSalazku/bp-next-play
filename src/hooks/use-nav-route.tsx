import { usePathname } from "next/navigation";

export const useNavRoute = () => {
  const segment = usePathname().split("/")[2]!;
  const title = segment.charAt(0).toLocaleUpperCase() + segment.slice(1);

  return title;
};
