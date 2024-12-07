import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = () => {
    const delta = 2; // Mostrar hasta 2 páginas a cada lado
    const range = [];
    const dots = "...";

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // Primera página
        i === totalPages || // Última página
        (i >= currentPage - delta && i <= currentPage + delta) // Páginas cercanas
      ) {
        range.push(i);
      }
    }

    const result = [];
    let lastPage = 0;

    for (const page of range) {
      if (page - lastPage > 1) {
        result.push({ type: "dots", key: `dots-${lastPage}-${page}` }); // Clave única para los puntos suspensivos
      }
      result.push({ type: "page", key: `page-${page}`, value: page });
      lastPage = page;
    }

    return result;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
      >
        &laquo;
      </button>

      {pageNumbers.map((item) =>
        item.type === "dots" ? (
          <span key={item.key} className="px-3 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={item.key}
            onClick={() => onPageChange(item.value)}
            className={`px-3 py-1 rounded-md ${
              currentPage === item.value
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {item.value}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
