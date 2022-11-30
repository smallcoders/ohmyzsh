import { useModel } from "umi";

export default function () {
    const { initialState } = useModel('@@initialState');

    return initialState?.currentUser?.type == 'MANAGER_ADMIN'
}
