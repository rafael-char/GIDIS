// dbConnection.js
const mysql = require("mysql2/promise");

const dbConfig = {
  host: "51.75.201.214",
  user: "jhoanufps",
  password: "BiDuQMCG!3e1RwK",
  database: "gidis_platform",
};

// Función para conectarse a la base de datos
async function connect() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Conexión a la base de datos establecida");
    return connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    throw error;
  }
}

async function execute(procedureName) {
  const connection = await connect();
  try {
    const [rows] = await connection.execute(`CALL ${procedureName}()`);
    return rows;
  } catch (error) {
    console.error(
      "Error al ejecutar el procedimiento almacenado:",
      error.message
    );
    throw error;
  } finally {
    connection.end();
  }
}
// Función para ejecutar un procedimiento almacenado
async function executeProcedure(procedureName, args) {
  const connection = await connect();
  try {
    const [rows] = await connection.execute(
      `CALL ${procedureName}(${args.map((_) => "?").join(", ")})`,
      args
    );
    return rows;
  } catch (error) {
    console.error(
      "Error al ejecutar el procedimiento almacenado:",
      error.message
    );
    throw error;
  } finally {
    connection.end();
  }
}

// Funcion para ejecutar un procedimiento almacenado con JSON
async function executeProcedureJSON(procedureName, jsonArgs) {
  const connection = await connect();
  try {
    const queryString = `CALL ${procedureName}(?)`;
    const [rows] = await connection.execute(queryString, [jsonArgs]);
    return rows;
  } catch (error) {
    console.error(
      "Error al ejecutar el procedimiento almacenado:",
      error.message
    );
    throw error;
  } finally {
    connection.end();
  }
}

//Funcion para ejecutar funcion con JSON

async function executeFunctionJSON(functionName, jsonArgs) {
    const connection = await connect();
    try {
        const queryString = `SELECT ${functionName}(?)`;
        const [rows] = await connection.execute(queryString, [jsonArgs]);
        return rows;
    } catch (error) {
        console.error("Error al ejecutar la funcion:", error.message);
        throw error;
    } finally {
        connection.end();
    }
}


module.exports = { connect, executeProcedure, executeProcedureJSON, execute, executeFunctionJSON};
