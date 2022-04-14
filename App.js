import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./pages/Home";
import { LogBox } from "react-native";

const Stack = createNativeStackNavigator();

function App() {
  LogBox.ignoreAllLogs();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Good Wishes"
          component={Home}
          options={{
            headerTintColor: "#0099FF",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#282A36",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
