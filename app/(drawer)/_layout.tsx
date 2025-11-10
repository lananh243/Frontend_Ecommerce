import { Drawer } from "expo-router/drawer";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import CustomDrawer from "@/components/Sidebar";

export default function DrawerLayout() {
  return (
    <Drawer
    drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: { width: 260, borderTopRightRadius: 25, borderBottomRightRadius: 25 },
        drawerActiveBackgroundColor: "#f0f0f0",
        drawerLabelStyle: { fontSize: 15, marginLeft: -15 },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Homepage",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color="black" />
          ),
          drawerLabelStyle: {
            color: "black",       
            marginLeft: 10,       
            fontWeight: "bold",   
          },
          drawerItemStyle: {
            marginVertical: 5,    
          },
        }}
      />

     <Drawer.Screen
      name="search"
      options={{
        title: "Discover",
        drawerIcon: ({ color, size }) => <Feather name="search" size={size} color={color} />,
        drawerLabelStyle: {
          color: "black",       
          marginLeft: 10,       
          fontWeight: "bold",   
        },
        drawerItemStyle: {
          marginVertical: 5,    
        },
      }}
    />


    <Drawer.Screen
      name="cart"
      options={{
        title: "My Order",
        drawerIcon: ({ color, size }) => <FontAwesome5 name="shopping-bag" size={size} color={color} />,
        drawerLabelStyle: {
          color: "black",       
          marginLeft: 10,       
          fontWeight: "bold",   
        },
        drawerItemStyle: {
          marginVertical: 5,    
        },
      }}
    />

    </Drawer>
  );
}
