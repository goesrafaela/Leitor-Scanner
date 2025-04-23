import { BarcodeData } from "../../interfaces/IBarcodeData";
import { NavigationProp } from "@react-navigation/native";

export interface HandleBarcodeScanParams {
  data: BarcodeData;
  isScanning: boolean;
  scanStep: "product" | "shelf";
  scanType: string;
  routeParams: { userUser?: string };
  setIsScanning: (value: boolean) => void;
  setBarcodeData: (value: string | null) => void;
  setScanMessage: (value: string) => void;
  setEtiquetaData: (value: any) => void;
  setEtiquetaModalVisible: (value: boolean) => void;
  setShelfBarcode: (value: string | null) => void;
  setShelfModalVisible: (value: boolean) => void;
  navigation: NavigationProp<any>;
}
