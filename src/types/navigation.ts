import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    Login: undefined;
    Home: { userUser: string; userName?: string; userEmail?: string };
    Scanner: { userUser?: string; scanType?: string; userName?: string; userEmail?: string };
    EtiquetaInfo: { etiquetaData: any; userUser?: string; userName?: string; userEmail?: string };
    AprovacaoInfo: { etiquetaData: any; userUser?: string; userName?: string; userEmail?: string };
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;