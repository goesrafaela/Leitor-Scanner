import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Login: undefined;
    Home: { userUser: string };
    Scanner: { userUser?: string; scanType?: string };
    EtiquetaInfo: { etiquetaData: any; userUser?: string };
    AprovacaoInfo: { etiquetaData: any; userUser?: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;