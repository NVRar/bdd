const BASE_URL = "http://127.0.0.1:5000";

let alumnoSeleccionado = null;
let actividadSeleccionada = null;

function mostrarError(mensaje) {
    alert(`Error: ${mensaje}`);
}

async function cargarAlumnos() {
    try {
        const response = await fetch(`${BASE_URL}/alumnos`);
        if (!response.ok) throw new Error("No se pudo obtener la lista de alumnos");
        const alumnos = await response.json();
        const tabla = document.getElementById("alumno-list");
        tabla.innerHTML = "";
        alumnos.forEach(alumno => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${alumno.padron}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.apellido}</td>
                <td>${alumno.edad}</td>
                <td>${alumno.email}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="mostrarModalEditarAlumno(${alumno.padron})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarAlumno(${alumno.padron})">Eliminar</button>
                    <button class="btn btn-info btn-sm" onclick="verActividades(${alumno.padron})">Ver Actividades</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    } catch (error) {
        mostrarError(error.message);
    }
}

async function agregarAlumno(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const edad = document.getElementById("edad").value;
    const email = document.getElementById("email").value;

    try {
        const response = await fetch(`${BASE_URL}/alumnos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, apellido, edad, email })
        });

        if (!response.ok) throw new Error("No se pudo agregar el alumno");
        alert("Alumno agregado exitosamente");
        document.getElementById("alumno-form").reset();
        cargarAlumnos();
    } catch (error) {
        mostrarError(error.message);
    }
}

async function eliminarAlumno(padron) {
    if (!confirm(`Estás seguro de eliminar al alumno con padrón ${padron}?`)) return;

    try {
        const response = await fetch(`${BASE_URL}/alumnos/${padron}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("No se pudo eliminar el alumno");
        alert("Alumno eliminado exitosamente");
        cargarAlumnos();
    } catch (error) {
        mostrarError(error.message);
    }
}

function mostrarModalEditarAlumno(padron) {
    alumnoSeleccionado = padron;
    const modal = new bootstrap.Modal(document.getElementById("modalEditarAlumno"));
    modal.show();
}

async function actualizarAlumno(event) {
    event.preventDefault();
    const nombre = document.getElementById("editar-nombre").value;
    const apellido = document.getElementById("editar-apellido").value;
    const edad = document.getElementById("editar-edad").value;
    const email = document.getElementById("editar-email").value;

    const datosActualizados = {};
    if (nombre) datosActualizados.nombre = nombre;
    if (apellido) datosActualizados.apellido = apellido;
    if (edad) datosActualizados.edad = edad;
    if (email) datosActualizados.email = email;

    try {
        const response = await fetch(`${BASE_URL}/alumnos/${alumnoSeleccionado}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) throw new Error("No se pudo actualizar el alumno");
        alert("Alumno actualizado exitosamente");
        cargarAlumnos();
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarAlumno"));
        modal.hide();
    } catch (error) {
        mostrarError(error.message);
    }
}

async function verActividades(padron) {
    try {
        const response = await fetch(`${BASE_URL}/alumnos/${padron}/actividades`);
        if (!response.ok) throw new Error("No se pudo obtener la lista de actividades");
        const actividades = await response.json();
        const tabla = document.getElementById("actividad-list");
        tabla.innerHTML = "";
        actividades.forEach(actividad => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${actividad._id}</td>
                <td>${actividad.padron}</td>
                <td>${actividad.actividad}</td>
                <td>${actividad.fecha}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="mostrarModalEditarActividad('${actividad._id}', ${padron})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarActividad('${actividad._id}', ${padron})">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    } catch (error) {
        mostrarError(error.message);
    }
}

function mostrarModalEditarActividad(id, padron) {
    actividadSeleccionada = { id, padron };
    const modal = new bootstrap.Modal(document.getElementById("modalEditarActividad"));
    modal.show();
}

async function actualizarActividad(event) {
    event.preventDefault();
    const actividad = document.getElementById("editar-actividad").value;
    const fecha = document.getElementById("editar-fecha").value;

    const datosActualizados = {};
    if (actividad) datosActualizados.actividad = actividad;
    if (fecha) datosActualizados.fecha = fecha;

    try {
        const response = await fetch(`${BASE_URL}/alumnos/${actividadSeleccionada.padron}/actividades/${actividadSeleccionada.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) throw new Error("No se pudo actualizar la actividad");
        alert("Actividad actualizada exitosamente");
        verActividades(actividadSeleccionada.padron);
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarActividad"));
        modal.hide();
    } catch (error) {
        mostrarError(error.message);
    }
}

async function agregarActividad(event) {
    event.preventDefault();
    const actividad = document.getElementById("actividad").value;
    const fecha = document.getElementById("fecha").value;
    const padron = document.getElementById("padron-actividad").value;

    try {
        const response = await fetch(`${BASE_URL}/alumnos/${padron}/actividades`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ actividad, fecha })
        });

        if (!response.ok) throw new Error("No se pudo agregar la actividad");
        alert("Actividad agregada exitosamente");
        document.getElementById("actividad-form").reset();
        verActividades(padron);
    } catch (error) {
        mostrarError(error.message);
    }
}

async function eliminarActividad(id, padron) {
    if (!confirm(`Estás seguro de eliminar esta actividad con ID ${id}?`)) return;

    try {
        const response = await fetch(`${BASE_URL}/alumnos/${padron}/actividades/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("No se pudo eliminar la actividad");
        alert("Actividad eliminada exitosamente");
        verActividades(padron);
    } catch (error) {
        mostrarError(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarAlumnos();
    document.getElementById("alumno-form").addEventListener("submit", agregarAlumno);
    document.getElementById("formEditarAlumno").addEventListener("submit", actualizarAlumno);
    document.getElementById("actividad-form").addEventListener("submit", agregarActividad);
    document.getElementById("formEditarActividad").addEventListener("submit", actualizarActividad);
});
