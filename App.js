import ImageFile from "./src/Screen/imageFile";
import SignIn from "./src/components/SignIn";
import SignUp from "./src/components/SignUp";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Sign In">
        <Stack.Screen name="Rigister" component={SignUp} />
        <Stack.Screen name="Home" component={ImageFile} />
        <Stack.Screen name="Sign In" component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
