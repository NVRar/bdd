FRONTEND_DIR := frontend
BACKEND_DIR := backend

preparar:
	@echo "Preparando el backend..."
	@$(MAKE) -C $(BACKEND_DIR) preparar
	@echo "Preparando el frontend..."
	@$(MAKE) -C $(FRONTEND_DIR) preparar

