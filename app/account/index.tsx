import { Redirect } from "expo-router";

export default function AccountIndex() {
  // Redirect to login by default
  return <Redirect href="/account/login" />;
}