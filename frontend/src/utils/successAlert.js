import Swal from 'sweetalert2'

const successAlert = (title)=>{
    const alert = Swal.fire({
        icon : "success",
        title: title,
        confirmButtonColor : "rgb(100, 96, 192)"
    });

    return alert
}

export default successAlert