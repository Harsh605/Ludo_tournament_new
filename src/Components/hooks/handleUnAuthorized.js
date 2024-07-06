import { useNavigate } from "react-router"
import Swal from "sweetalert2"


const handleUnAuthorized = (msg, callback) => {
    if (msg === "pls login") {
        localStorage.removeItem('access_token')
        localStorage.removeItem('adminDetails')
        localStorage.removeItem('access_token_expiration')
        callback('/')
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong",
        });
    }

}

export { handleUnAuthorized }