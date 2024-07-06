import { useNavigate } from "react-router"
import Swal from "sweetalert2"


const handleUnAuthorized = (status, callback) => {
    if (status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('access_token_expiration');
        callback('/LoginPage')
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong",
        });
    }

}

export { handleUnAuthorized }