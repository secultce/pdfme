import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top-right",
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen(popup: HTMLElement) {
        popup.onmouseenter = Swal.stopTimer;
        popup.onmouseleave = Swal.resumeTimer;
    },
})

export default Toast;
