from flask import Blueprint, request, jsonify
from .models import Alumno
from . import db, mongo_client
from bson.objectid import ObjectId

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return "TP BDD - Gestión de Alumnos"

@main.route('/alumnos', methods=['POST'])
def crear_alumno():
    data = request.get_json()

    email_existente = Alumno.query.filter_by(email=data['email']).first()
    if email_existente:
        return jsonify({"error": "El email ya está registrado"}), 400

    if not all(key in data for key in ["nombre", "apellido", "edad", "email"]):
        return jsonify({"error": "Faltan campos requeridos"}), 400

    nuevo_alumno = Alumno(
        nombre=data['nombre'],
        apellido=data['apellido'],
        edad=data['edad'],
        email=data['email']
    )

    db.session.add(nuevo_alumno)
    db.session.commit()

    return jsonify({
        "mensaje": "Alumno creado exitosamente",
        "padron": nuevo_alumno.padron 
    }), 201


@main.route('/alumnos', methods=['GET'])
def listar_alumnos():
    alumnos = Alumno.query.all()

    resultado = [
        {
            "padron": alumno.padron,
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "edad": alumno.edad,
            "email": alumno.email,
        }
        for alumno in alumnos
    ]

    return jsonify(resultado), 200

@main.route('/alumnos/<int:padron>', methods=['DELETE'])
def eliminar_alumno(padron):
    alumno = Alumno.query.filter_by(padron=padron).first()

    if not alumno:
        return jsonify({"error": "Alumno no encontrado"}), 404

    mongo_db = mongo_client.alumnos_no_sql
    actividades = mongo_db.actividades
    actividades.delete_many({"padron": padron})

    db.session.delete(alumno)
    db.session.commit()

    return jsonify({"mensaje": f"Alumno con padrón {padron} eliminado exitosamente"}), 200

@main.route('/alumnos/<int:padron>', methods=['PUT'])
def actualizar_alumno(padron):
    data = request.get_json()

    alumno = Alumno.query.filter_by(padron=padron).first()
    if not alumno:
        return jsonify({"error": "Alumno no encontrado"}), 404

    if 'email' in data and data['email'] != alumno.email:
        email_existente = Alumno.query.filter_by(email=data['email']).first()
        if email_existente:
            return jsonify({"error": "El email ya esta registrado por otro alumno"}), 400

    alumno.nombre = data.get('nombre', alumno.nombre)
    alumno.apellido = data.get('apellido', alumno.apellido)
    alumno.edad = data.get('edad', alumno.edad)
    alumno.email = data.get('email', alumno.email)

    db.session.commit()

    return jsonify({
        "mensaje": f"Alumno con padron {padron} actualizado exitosamente"
    }), 200


@main.route('/alumnos/<int:padron>/actividades', methods=['POST'])
def agregar_actividad(padron):
    alumno = Alumno.query.filter_by(padron=padron).first()
    if not alumno:
        return jsonify({"error": f"El padrón {padron} no existe"}), 404

    data = request.get_json()
    actividad = {
        "padron": padron,
        "actividad": data['actividad'],
        "fecha": data.get('fecha', "No especificada")
    }
    
    mongo_db = mongo_client.alumnos_no_sql
    actividades = mongo_db.actividades
    actividades.insert_one(actividad)

    return jsonify({"mensaje": "Actividad registrada exitosamente"}), 201

@main.route('/alumnos/<int:padron>/actividades', methods=['GET'])
def listar_actividades(padron):
    alumno = Alumno.query.filter_by(padron=padron).first()
    if not alumno:
        return jsonify({"error": f"El padrón {padron} no existe"}), 404

    mongo_db = mongo_client.alumnos_no_sql
    actividades = mongo_db.actividades

    resultado = [
        {
            "_id": str(actividad["_id"]),
            "padron": actividad["padron"],
            "actividad": actividad["actividad"],
            "fecha": actividad["fecha"]
        }
        for actividad in actividades.find({"padron": padron})
    ]

    return jsonify(resultado), 200


@main.route('/alumnos/<int:padron>/actividades/<actividad_id>', methods=['PUT'])
def modificar_actividad(padron, actividad_id):
    data = request.get_json()
    mongo_db = mongo_client.alumnos_no_sql
    actividades = mongo_db.actividades

    alumno = Alumno.query.filter_by(padron=padron).first()
    if not alumno:
        return jsonify({"error": f"El padrón {padron} no existe"}), 404

    actividad = actividades.find_one({"_id": ObjectId(actividad_id), "padron": padron})
    if not actividad:
        return jsonify({"error": "La actividad no existe para el padrón especificado"}), 404

    nueva_actividad = {
        "actividad": data.get("actividad", actividad["actividad"]),
        "fecha": data.get("fecha", actividad["fecha"])
    }
    actividades.update_one({"_id": ObjectId(actividad_id)}, {"$set": nueva_actividad})

    return jsonify({"mensaje": "Actividad actualizada exitosamente"}), 200

@main.route('/alumnos/<int:padron>/actividades/<actividad_id>', methods=['DELETE'])
def eliminar_actividad(padron, actividad_id):
    mongo_db = mongo_client.alumnos_no_sql
    actividades = mongo_db.actividades

    alumno = Alumno.query.filter_by(padron=padron).first()
    if not alumno:
        return jsonify({"error": f"El padrón {padron} no existe"}), 404

    actividad = actividades.find_one({"_id": ObjectId(actividad_id), "padron": padron})
    if not actividad:
        return jsonify({"error": "La actividad no existe para el padrón especificado"}), 404

    actividades.delete_one({"_id": ObjectId(actividad_id)})

    return jsonify({"mensaje": "Actividad eliminada exitosamente"}), 200
