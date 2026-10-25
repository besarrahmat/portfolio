import { Shell } from "@/components/shell/shell";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return <Shell>{children}</Shell>;
}
