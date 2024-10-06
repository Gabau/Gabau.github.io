import { useContext } from "react";
import ModalContext from "../context/ModalContext";


export default function useModals() {
    return useContext(ModalContext);
}