import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Login: undefined;
    Home: { userUser: string };
    Scanner: { userName?: string };
    EtiquetaInfo: { etiquetaData: any; userName?: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;