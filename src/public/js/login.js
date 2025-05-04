const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault(); 
    
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    // Hacer una solicitud POST a la ruta de login
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),  
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        if (result.status === 200) {
            result.json()
                .then(json => {
                    // Guardamos el token JWT
                    localStorage.setItem('authToken', json.jwt);  

                    console.log("Token JWT guardado en localStorage:");
                    console.log(localStorage.getItem('authToken'));   
                    alert("Login realizado con exito!");

                    window.location.replace('/users');
                });
        } else if (result.status === 401) {
            console.log(result);
            alert("Login invalido, revisa tus credenciales!");
        }
    })
    .catch(err => {
        console.error("Error al realizar el login:", err);
        alert("Hubo un error al intentar iniciar sesión.");
    });
});  