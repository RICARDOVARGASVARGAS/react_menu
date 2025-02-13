import React from "react";
import {
  FaCar,
  FaFileAlt,
  FaUsers,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaPlayCircle,
  FaGraduationCap,
} from "react-icons/fa";

const Home = () => {
  // Datos de ejemplo para los videotutoriales
  const videotutoriales = [
    {
      id: 1,
      title: "Introducción al Sistema",
      url: "https://www.youtube.com/watch?v=ejemplo1",
    },
    {
      id: 2,
      title: "Registro de Conductores",
      url: "https://www.youtube.com/watch?v=ejemplo2",
    },
    {
      id: 3,
      title: "Gestión de Vehículos",
      url: "https://www.youtube.com/watch?v=ejemplo3",
    },
    {
      id: 4,
      title: "Asignación de Permisos",
      url: "https://www.youtube.com/watch?v=ejemplo4",
    },
    {
      id: 5,
      title: "Configuración de Roles",
      url: "https://www.youtube.com/watch?v=ejemplo5",
    },
    {
      id: 6,
      title: "Generación de Reportes",
      url: "https://www.youtube.com/watch?v=ejemplo6",
    },
    {
      id: 7,
      title: "Uso de Filtros",
      url: "https://www.youtube.com/watch?v=ejemplo7",
    },
    {
      id: 8,
      title: "Gestión de Usuarios",
      url: "https://www.youtube.com/watch?v=ejemplo8",
    },
    {
      id: 9,
      title: "Personalización del Sistema",
      url: "https://www.youtube.com/watch?v=ejemplo9",
    },
    {
      id: 10,
      title: "Soporte Técnico",
      url: "https://www.youtube.com/watch?v=ejemplo10",
    },
  ];

  // Datos de los desarrolladores
  const desarrolladores = [
    {
      nombre: "Juan Pérez",
      rol: "Desarrollador Frontend",
      titulo: "Ingeniero en Sistemas Computacionales",
      imagen: "/images/juan-perez.jpg", // Ruta de la imagen
      email: "juan.perez@example.com",
      telefono: "+51 987 654 321",
      linkedin: "https://linkedin.com/in/juanperez",
      github: "https://github.com/juanperez",
      descripcion:
        "Especializado en desarrollo frontend con React, TypeScript y diseño UX/UI. Con más de 5 años de experiencia en proyectos web empresariales.",
      habilidades: ["React", "TypeScript", "CSS3", "Figma"],
    },
    {
      nombre: "María Gómez",
      rol: "Desarrolladora Backend",
      titulo: "Ingeniera en Ciencias de la Computación",
      imagen: "/images/maria-gomez.jpg", // Ruta de la imagen
      email: "maria.gomez@example.com",
      telefono: "+51 987 654 322",
      linkedin: "https://linkedin.com/in/mariagomez",
      github: "https://github.com/mariagomez",
      descripcion:
        "Experta en backend con Node.js, Python y bases de datos relacionales/no relacionales. Ha liderado proyectos de escalabilidad y optimización.",
      habilidades: ["Node.js", "Python", "MongoDB", "PostgreSQL"],
    },
  ];

  // Función para obtener la miniatura de YouTube
  const getYouTubeThumbnail = (url) => {
    const videoId = url.split("v=")[1];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center p-4">
      {/* Título Principal */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Sistema de Gestión Vehicular
      </h1>
      {/* Descripción */}
      <p className="text-lg text-gray-600 max-w-2xl text-center mb-8">
        Bienvenido al Sistema de Control Vehicular (SECoV). Aquí podrás
        gestionar vehículos, conductores, licencias, permisos y más, todo desde
        una única plataforma diseñada para entidades públicas.
      </p>

      {/* Sección de Características */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 w-full max-w-6xl">
        {[
          {
            icon: <FaCar className="text-4xl text-blue-600 mx-auto mb-3" />,
            title: "Gestión de Vehículos",
            description: "Administra todos los vehículos registrados.",
          },
          {
            icon: <FaUsers className="text-4xl text-green-600 mx-auto mb-3" />,
            title: "Conductores",
            description: "Registra y gestiona a los conductores autorizados.",
          },
          {
            icon: (
              <FaFileAlt className="text-4xl text-purple-600 mx-auto mb-3" />
            ),
            title: "Licencias y Permisos",
            description: "Controla licencias y permisos vehiculares.",
          },
          {
            icon: (
              <FaCalendarAlt className="text-4xl text-yellow-600 mx-auto mb-3" />
            ),
            title: "Historial y Reportes",
            description: "Consulta historiales y genera reportes detallados.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-200"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Sección de Videotutoriales */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Videotutoriales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videotutoriales.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <img
                src={getYouTubeThumbnail(video.url)}
                alt={video.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200">
                <FaPlayCircle className="text-4xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 p-4">
                {video.title}
              </h3>
            </a>
          ))}
        </div>
      </div>

      {/* Sección "Acerca de los Desarrolladores" */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Acerca de los Desarrolladores
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {desarrolladores.map((dev, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative group"
            >
              {/* Imagen del desarrollador */}
              <div className="flex flex-col items-center mb-4">
                <img
                  src={dev.imagen}
                  alt={dev.nombre}
                  className="w-28 h-28 rounded-full border-4 border-blue-200 shadow-md transition-transform duration-300 group-hover:scale-105"
                />
                <h3 className="text-xl font-semibold text-gray-800 mt-2">
                  {dev.nombre}
                </h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <FaGraduationCap className="mr-1 text-blue-500" />{" "}
                  {dev.titulo}
                </p>
                <p className="text-sm text-gray-600">{dev.rol}</p>
              </div>
              {/* Descripción */}
              <p className="text-gray-700 text-sm mb-4">{dev.descripcion}</p>
              {/* Habilidades */}
              <div className="flex flex-wrap gap-2 mb-4">
                {dev.habilidades.map((habilidad, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {habilidad}
                  </span>
                ))}
              </div>
              {/* Contacto */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <FaEnvelope className="mr-2 text-blue-500" />
                  <a
                    href={`mailto:${dev.email}`}
                    className="hover:text-blue-600"
                  >
                    {dev.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaPhone className="mr-2 text-green-500" />
                  <a
                    href={`tel:${dev.telefono}`}
                    className="hover:text-green-600"
                  >
                    {dev.telefono}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaLinkedin className="mr-2 text-blue-700" />
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-700"
                  >
                    LinkedIn
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaGithub className="mr-2 text-gray-800" />
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-800"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
