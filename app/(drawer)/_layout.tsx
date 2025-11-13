import { Drawer } from "expo-router/drawer";
import Sidebar from "@/components/Sidebar";
import { Ionicons } from "@expo/vector-icons";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: 260,
          borderTopRightRadius: 25,
          borderBottomRightRadius: 25,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Homepage",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
