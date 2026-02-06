# 🔒 IMPORTANTE - SEGURIDAD Y DATOS SENSIBLES

## ⚠️ **ARCHIVOS QUE NUNCA DEBEN SUBIRSE A GIT**

### 🚨 **CRÍTICO - Información Sensible**
- **`data/users.json`** - Contiene contraseñas hasheadas y datos reales de usuarios
- **`.env`** - Variables de entorno con secretos (JWT_SECRET, etc.)
- **`config/production.json`** - Configuraciones de producción con credenciales

### 📁 **Otros Archivos Sensibles**
- **`logs/`** - Pueden contener información sensible del sistema
- **`uploads/`** - Archivos subidos por usuarios
- **`node_modules/`** - Dependencias (muy pesadas)

## ✅ **ARCHIVOS SEGUROS PARA INCLUIR**
- **`data/users.example.json`** - Datos de ejemplo sin información real
- **`.env.example`** - Plantilla de variables sin valores secretos
- **Toda la documentación** (README.md, *.md)
- **Código fuente** (src/, public/, server.js)

## 🛡️ **MEJORES PRÁCTICAS**

### **Antes de hacer commit:**
```bash
# Verificar que no hay archivos sensibles
git status

# Revisar cambios antes de commit
git diff --cached

# Usar .gitignore para proteger archivos
git check-ignore -v <archivo>
```

### **Para nuevos colaboradores:**
1. Clonar el repositorio
2. Ejecutar `setup-dev.bat` (Windows) o `setup-dev.sh` (Linux/Mac)
3. Configurar variables en `.env`
4. Crear usuarios de prueba si es necesario

### **Para deploy en producción:**
1. Usar variables de entorno de la plataforma (Render, Railway, etc.)
2. **NUNCA** subir archivos con datos reales
3. Usar diferentes bases de datos para dev/prod
4. Regenerar JWT_SECRET para cada entorno

## 🔄 **Si Ya Subiste Archivos Sensibles**

### **Remover del historial de Git:**
```bash
# Remover archivo del tracking pero mantener local
git rm --cached data/users.json

# Agregar a .gitignore
echo "data/users.json" >> .gitignore

# Commit los cambios
git add .gitignore
git commit -m "Add users.json to .gitignore"

# Para remover completamente del historial (CUIDADO!)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch data/users.json' \
--prune-empty --tag-name-filter cat -- --all
```

## 🎯 **CHECKLIST DE SEGURIDAD**

### **Antes de hacer deploy:**
- [ ] **.env** no está en el repositorio
- [ ] **users.json** no está en el repositorio
- [ ] **JWT_SECRET** es diferente al de desarrollo
- [ ] **Variables de entorno** configuradas en la plataforma
- [ ] **CORS** configurado para el dominio correcto
- [ ] **Headers de seguridad** habilitados

### **Para presentaciones académicas:**
- [ ] Usar datos de ejemplo/demo solamente
- [ ] No incluir información personal real
- [ ] Tener usuarios de prueba listos
- [ ] URL de deploy funcionando y testeada

---

## 🚨 **RECUERDA**

**La seguridad de datos es fundamental.** Siempre verifica qué archivos estás subiendo a repositorios públicos. Una vez que algo está en internet, es muy difícil eliminarlo completamente.

**¡La protección de datos de usuarios es una responsabilidad legal y ética!**