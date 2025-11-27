import { useLocation } from "react-router-dom";

export default function useIsChat() {
  const location = useLocation();
  return location.pathname === "/chat";
}
