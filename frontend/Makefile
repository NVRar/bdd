FRONTEND_SERVER_PORT := 8000

preparar:
	@echo "Instalando Flask-CORS si es necesario..."
	@pip show flask-cors > /dev/null || pip install flask-cors
	@echo "\033[0;32mFrontend preparado exitosamente\033[0m"

iniciar:
	@echo "\033[0;32mIniciando servidor del front-end en el puerto $(FRONTEND_SERVER_PORT)\033[0m"
	@python3 -m http.server $(FRONTEND_SERVER_PORT)
