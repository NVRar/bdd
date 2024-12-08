# Makefile para preparar el entorno del proyecto

.PHONY: preparar iniciar

preparar:
	@echo "Actualizando el sistema..."
	sudo apt update -y
	@echo "Instalando dependencias necesarias..."
	sudo apt install -y python3 python3-pip python3-venv sqlite3 curl
	@echo "Instalando MongoDB..."
	curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-6.0.gpg
	echo "deb [signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
	sudo apt update && sudo apt install -y mongodb-org
	@echo "Iniciando y habilitando MongoDB..."
	sudo systemctl start mongod
	sudo systemctl enable mongod
	@echo "Creando entorno virtual en env/..."
	python3 -m venv env
	@echo "Activando entorno virtual e instalando dependencias de requirements.txt..."
	. env/bin/activate && pip install --upgrade pip && pip install -r requirements.txt
	@echo "Preparación completada. Ahora puedes ejecutar 'make iniciar'."

iniciar:
	@echo "Activando entorno virtual y ejecutando la aplicación..."
	. env/bin/activate && python3 app.py
