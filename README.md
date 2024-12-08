# bdd

Documentación de Endpoints
1. CREAR UN ALUMNO
Método: POST
Endpoint: /alumnos
Descripción: Crea un nuevo alumno en la base de datos relacional.
Body (JSON):
json
{
    "nombre": "Paola",
    "apellido": "Argento",
    "edad": 20,
    "email": "paola.argento@example.com"
}

Respuestas:

201 Created:
json
{
    "mensaje": "Alumno creado exitosamente",
    "padron": 1
}

400 Bad Request (Email ya registrado):
json
{
    "error": "El email ya está registrado por otro alumno"
}


2. LISTAR ALUMNOS
Método: GET
Endpoint: /alumnos
Descripción: Lista todos los alumnos registrados

Respuestas:
200 OK:
json
[
    {
        "padron": 1,
        "nombre": "Paola",
        "apellido": "Argento",
        "edad": 20,
        "email": "paola.argento@example.com"
    },
    {
        "padron": 2,
        "nombre": "José",
        "apellido": "Argento",
        "edad": 50,
        "email": "jose.argento@example.com"
    }
]

3. ACTUALIZAR UN ALUMNO
Método: PUT
Endpoint: /alumnos/<padron>
Descripción: Actualiza los datos de un alumno específico.
Body (JSON):
json
{
    "nombre": "Paola María",
    "email": "paola.maria@example.com"
}

Respuestas:
200 OK:
json
{
    "mensaje": "Alumno con padrón 1 actualizado exitosamente"
}


404 Not Found:
json
{
    "error": "Alumno no encontrado"
}


400 Bad Request (Email ya registrado):
json
{
    "error": "El email ya está registrado por otro alumno"
}


4. ELIMINAR UN ALUMNO
Método: DELETE
Endpoint: /alumnos/<padron>
Descripción: Elimina un alumno y sus actividades asociadas.
Respuestas:
200 OK:
json
{
    "mensaje": "Alumno con padrón 1 eliminado exitosamente"
}

404 Not Found:
json
{
    "error": "Alumno no encontrado"
}


5. AGREGAR ACTIVIDAD
Método: POST
Endpoint: /alumnos/<padron>/actividades
Descripción: Agrega una actividad asociada a un alumno.
Body (JSON):
json
{
    "actividad": "Asistencia a clase",
    "fecha": "2024-12-08"
}

Respuestas:
201 Created:
json
{
    "mensaje": "Actividad registrada exitosamente"
}


404 Not Found:
json
{
    "error": "El padrón 1 no existe"
}


6. LISTAR ACTIVIDADES
Método: GET
Endpoint: /alumnos/<padron>/actividades
Descripción: Lista todas las actividades asociadas a un alumno.
Respuestas:
200 OK:
json
[
    {
        "_id": "64a7f4d2f7a93b8aabcd1234",
        "padron": 1,
        "actividad": "Asistencia a clase",
        "fecha": "2024-12-08"
    },
    {
        "_id": "64a7f4d2f7a93b8aabcd5678",
        "padron": 1,
        "actividad": "Examen parcial",
        "fecha": "2024-12-09"
    }
]


404 Not Found:
json
{
    "error": "El padrón 1 no existe"
}

7. MODIFICAR ACTIVIDAD
Método: PUT
Endpoint: /alumnos/<padron>/actividades/<actividad_id>
Descripción: Modifica una actividad específica.
Body (JSON):
json
{
    "actividad": "Examen final",
    "fecha": "2024-12-15"
}

Respuestas:
200 OK:
json
{
    "mensaje": "Actividad actualizada exitosamente"
}

404 Not Found (Padrón no existe):
json
{
    "error": "El padrón 1 no existe"
}

404 Not Found (Actividad no existe):
json
{
    "error": "La actividad no existe para el padrón especificado"
}


8. ELIMINAR ACTIVIDAD
Método: DELETE
Endpoint: /alumnos/<padron>/actividades/<actividad_id>
Descripción: Elimina una actividad específica.
Respuestas:
200 OK:
json
{
    "mensaje": "Actividad eliminada exitosamente"
}

404 Not Found (Padrón no existe):
json
{
    "error": "El padrón 1 no existe"
}

404 Not Found (Actividad no existe):
json
{
    "error": "La actividad no existe para el padrón especificado"
}

