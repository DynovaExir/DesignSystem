import { CallbackLoader } from "@/components/auth/CallbackLoader";

export const metadata = {
  title: "Signing in... - Dynova",
  description: "Completing authentication",
};

export default function CallbackPage() {
  return <CallbackLoader />;
}
