import { createContext } from "react";



const ModalContext = createContext<{
    modal: ModalTypes,
    modalProps?: ModalProps,
    setModalType: (type: ModalTypes, modal_props?: ModalProps) => void
}>({
    modal: 'none',
    setModalType: () => { }
});

export default ModalContext