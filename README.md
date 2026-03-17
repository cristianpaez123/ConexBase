# 🛏️ ConexBase
### Sistema ERP para gestión de producción  
**Empresa:** BaseCamas El Dormilón

---

# 📌 Descripción del Proyecto

**ConexBase** es un sistema ERP desarrollado para gestionar y optimizar el proceso de producción de camas y muebles dentro de la empresa **BaseCamas El Dormilón**.

El sistema permite **centralizar la información de pedidos, producción y control de tareas**, reemplazando procesos manuales que actualmente se realizan mediante papeles, hojas de cálculo o aplicaciones de mensajería.

La aplicación permite mejorar:

- Organización del proceso productivo
- Control del estado de los pedidos
- Comunicación entre áreas
- Seguimiento de producción
- Trazabilidad de los pedidos

Aunque el sistema se desarrolla inicialmente para una empresa del sector mobiliario, su arquitectura está diseñada para ser **genérica y adaptable a otros procesos productivos**.

---

# 🎯 Objetivos del Sistema

- Digitalizar el proceso de registro de pedidos
- Organizar la asignación de tareas de producción
- Mejorar la comunicación entre ventas y producción
- Permitir seguimiento en tiempo real del estado de cada pedido
- Optimizar los tiempos de fabricación

---

# 📄 Ficha Técnica del Proyecto

| Campo | Información |
|------|-------------|
| **Nombre del sistema** | ConexBase |
| **Empresa** | BaseCamas El Dormilón |
| **Tipo de sistema** | Sistema de información integrado |
| **Modalidad** | Monolítica con separación Backend / Frontend |
| **Acceso** | Navegador web (local o en red) |
| **Versión** | 1.0.0 |
| **Estado** | En desarrollo |

---

# 🏗️ Arquitectura del Sistema

El sistema utiliza una **arquitectura monolítica con separación entre frontend y backend**.

```
Frontend (Angular)
      │
      │ HTTP / JSON
      ▼
Backend (Flask API REST)
      │
      ▼
Base de Datos MySQL
```

Componentes principales:

- **Frontend:** interfaz de usuario
- **Backend:** lógica del negocio y API
- **Base de datos:** almacenamiento de información

---

# ⚙️ Tecnologías Utilizadas

## Backend

- Python 3.10+
- Flask
- Flask-CORS
- mysql-connector-python

## Frontend

- Angular
- TypeScript
- HTML5
- CSS3
- Angular Material
- Bootstrap

## Base de Datos

- MySQL
- Motor InnoDB
- Charset UTF8MB4

## Herramientas

- Git
- GitHub
- Visual Studio Code
- XAMPP
- phpMyAdmin
- Figma

---

# 💻 Entorno de Desarrollo

**IDE:** Visual Studio Code  

Extensiones utilizadas:

- Python  
- Pylance  
- ESLint  
- Prettier  
- GitLens  
- REST Client  
- MySQL Extension  

Visual Studio Code permite trabajar simultáneamente en **backend y frontend** dentro del mismo entorno.

---

# 📂 Estructura del Proyecto

Ejemplo de organización del repositorio:

```
conexbase/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── database/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│
├── database/
│   └── schema.sql
│
├── docs/
│
└── README.md
```

---

# 🧩 Módulos del Sistema

El sistema estará compuesto por los siguientes módulos:

## 📦 Gestión de pedidos
- Registro de pedidos
- Edición de pedidos
- Consulta de pedidos

## 🏭 Producción
- Asignación de tareas
- Seguimiento de fabricación
- Estado de producción

## 👥 Gestión de usuarios
- Administración de usuarios
- Control de roles

## 📊 Seguimiento y control
- Estado de pedidos
- Control de tiempos
- Historial de producción

---

# 🚀 Instalación del Proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/conexbase.git
```

---

## 2. Backend

Entrar a la carpeta backend

```bash
cd backend
```

Instalar dependencias

```bash
pip install flask flask-cors mysql-connector-python
```

Ejecutar servidor

```bash
python app.py
```

Servidor disponible en:

```
http://localhost:5000
```

---

## 3. Frontend

Entrar a la carpeta frontend

```bash
cd frontend
```

Instalar dependencias

```bash
npm install
```

Ejecutar aplicación

```bash
ng serve
```

Disponible en:

```
http://localhost:4200
```

---

# 🗄️ Base de Datos

El sistema utiliza **MySQL** como motor de base de datos.

Herramientas utilizadas:

- XAMPP
- phpMyAdmin

Características:

- Motor **InnoDB**
- Soporte de **claves foráneas**
- Codificación **UTF8MB4**

---

# 📌 Estado del Proyecto

🚧 En desarrollo

Versión actual:

```
v1.0.0
```

---

# 👨‍💻 Autor

Proyecto desarrollado como sistema de gestión para la empresa:

**BaseCamas El Dormilón**

Sistema: **ConexBase**
