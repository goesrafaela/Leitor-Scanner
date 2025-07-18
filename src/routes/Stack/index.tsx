import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../../screens/Home";
import Scanner from "../../screens/Scanner";
import ManualInput from "../../screens/ManualInput";
import EtiquetaInfo from "../../screens/EtiquetaInfo";
import AprovacaoInfo from "../../screens/AprovacaoInfo";
import Login from "../../screens/Login";

const { Navigator, Screen } = createNativeStackNavigator();

export default function () {
  return (
    <Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Screen name="Login" component={Login} />
      <Screen name="Home" component={Home} />
      <Screen name="Scanner" component={Scanner} />
      <Screen name="ManualInput" component={ManualInput} />
      <Screen name="EtiquetaInfo" component={EtiquetaInfo} />
      <Screen name="AprovacaoInfo" component={AprovacaoInfo} />
    </Navigator>
  );
}
