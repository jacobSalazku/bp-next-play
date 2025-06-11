import { usePathname } from "next/navigation";

export const useNavRoute = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const segment = segments[2] ?? segments[1] ?? "Dashboard";

  const title = segment.charAt(0).toUpperCase() + segment.slice(1);

  return title;
};
