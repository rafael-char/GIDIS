const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dbConnection = require("../dbConnection");
const bodyParser = require('body-parser');

router.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const fileType = path.extname(file.originalname).toLowerCase();
      let uploadPath = '';
  
      if (['.pdf', '.doc', '.docx', '.xls', '.xlsx'].includes(fileType)) {
        uploadPath = 'subidas/documentos';
      } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(fileType)) {
        uploadPath = 'subidas/imagenes';
      } else {
        return cb(new Error('Tipo de archivo no permitido'));
      }
  
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
    //concateno la fecha de hoy con el nombre del archivo
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  });
  
  const upload = multer({ storage: storage });


router.post('/documentos',  upload.single('documento'), async (req, res) => {
    //saber si llega un documento
    console.log(req.file);
    try{
        if(req.headers.orden=='crear'){
            if (req.file) {
                const parametros = {
                    titulo: req.headers.titulo,
                    descripcion: req.headers.descripcion,
                    ruta: req.file.path,
                    token: req.headers.token,
                    usuario: req.headers.usuario,
                    api_token : req.headers.api_token,
                    tags: req.headers.tags,
                };
                console.log(req.file.path);
                const paramJson = JSON.stringify(parametros);
                console.log(paramJson);
                const result = await dbConnection.executeProcedureJSON("crear_documento", paramJson);
                console.log(result[0][0]);
                res.json(result[0][0]);
            } else {
                res.json({
                    e: 0,
                    mensaje: 'Error al subir el archivo',
                });
            }
        }else if(req.headers.orden =='listar'){

            const parametros = {
                token: req.headers.token,
                api_token : req.headers.api_token,
                usuario: req.headers.usuario,
                filtrar: req.headers.filtrar
            };
            const paramJson = JSON.stringify(parametros);
            console.log(paramJson);
            const result = await dbConnection.executeProcedureJSON("listar_documentos", paramJson);
            console.log(result[0][0]);
            res.json(result[0][0]);
        }else if(req.headers.orden =='editar'){
            const parametros = {
                id_documento: req.headers.id_documento,
                titulo: req.headers.titulo,
                descripcion: req.headers.descripcion,
                ruta: req.file.path,
                token: req.headers.token,
                usuario: req.headers.usuario,
                api_token : req.headers.api_token,
                tags: req.headers.tags
            };
            const paramJson = JSON.stringify(parametros);
            console.log(paramJson);
            const result = await dbConnection.executeProcedureJSON("editar_documento", paramJson);
            console.log(result[0][0]);
            res.json(result[0][0]);
    }else if(req.headers.orden =='eliminar'){
        const parametros = {
            token: req.headers.token,
            api_token : req.headers.api_token,
            usuario: req.headers.usuario,
            id_documento: req.headers.id_documento
        };
        const paramJson = JSON.stringify(parametros);
        console.log(paramJson);
        const result = await dbConnection.executeProcedureJSON("eliminar_documento", paramJson);
        console.log(result[0][0]);
        res.json(result[0][0]);
    }else{
            res.json({
                e: 0,
                mensaje: "Orden no permitida",
            });
        }
    }catch(error){
            console.error("Error:", error.message);
            res.json({
                e: 3,
                mensaje: error.message,
            });
        }
});

router.post('/login', async (req, res) => {
    try{
        const parametros = {
            usuario: req.headers.usuario,
            clave: req.headers.clave,
            token: req.headers.token,
            api_token : req.headers.api_token,
            orden: req.headers.orden,
        };
        const paramJson = JSON.stringify(parametros);
        console.log(paramJson);

        const result = await dbConnection.executeFunctionJSON("validar_usuario", paramJson);
        console.log(result[0]);
        let innerJson = JSON.parse(result[0]['validar_usuario(?)']);
        res.json(innerJson);
    }catch(error){
        console.error("Error:", error.message);
        res.json({
            e: 3,
            mensaje: error.message,
        });
    }
});

router.post('/publicaciones', async (req, res) => {

    try{
        if(req.headers.orden=='crear'){
            const parametros = {
                token: req.headers.token,
                api_token : req.headers.api_token,
                usuario: req.headers.usuario,
                titulo: req.headers.titulo,
                contenido: req.headers.contenido,
                tags: req.headers.tags
            };
            const paramJson = JSON.stringify(parametros);
            console.log(paramJson);
            const result = await dbConnection.executeProcedureJSON("crear_publicacion", paramJson);
            console.log(result[0][0]);
            res.json(result[0][0]);
        }else if(req.headers.orden =='listar'){
            const parametros = {
                token: req.headers.token,
                api_token : req.headers.api_token,
                usuario: req.headers.usuario,
                filtrar: req.headers.filtrar
            };
            const paramJson = JSON.stringify(parametros);
            console.log(paramJson);
            const result = await dbConnection.executeProcedureJSON("listar_publicaciones", paramJson);
            console.log(result[0][0]);
            res.json(result[0][0]);
        }else if(req.headers.orden =='editar'){
            const parametros = {
                token: req.headers.token,
                api_token : req.headers.api_token,
                usuario: req.headers.usuario,
                id_publicacion: req.headers.id_publicacion,
                titulo: req.headers.titulo,
                contenido: req.headers.contenido,
                tags: req.headers.tags
            };
            const paramJson = JSON.stringify(parametros);
            console.log(paramJson);
            const result = await dbConnection.executeProcedureJSON("editar_publicacion", paramJson);
            console.log(result[0][0]);
            res.json(result[0][0]);
        }else if(req.headers.orden =='eliminar'){
            const parametros = {
                token: req.headers.token,
                api_token : req.headers.api_token,
                usuario: req.headers.usuario,
                id_publicacion: req.headers.id_publicacion
            };
            const paramJson = JSON.stringify(parametros);
            console.log(paramJson);
            const result = await dbConnection.executeProcedureJSON("eliminar_publicacion", paramJson);
            console.log(result[0][0]);
            res.json(result[0][0]);
        }else{
            res.json({
                e: 0,
                mensaje: "Orden no permitida",
            });
        }
    }catch(error){
        console.error("Error:", error.message);
        res.json({
            e: 3,
            mensaje: error.message,
        });
    }
});


router.post('/menu', async (req, res) => {
    try{
        console.log(req.body);
        const parametros = {
            token: req.headers.token,
            api_token : req.headers.api_token,
            usuario: req.headers.usuario,
            orden: req.headers.orden,
            menu: req.body
        };
        const paramJson = JSON.stringify(parametros);
        console.log(paramJson);
        const result = await dbConnection.executeProcedureJSON("crear_menu", paramJson);
        console.log(result[0][0]);
        res.json(result[0][0]);
    }catch(error){
        console.error("Error:", error.message);
        res.json({
            e: 3,
            mensaje: error.message,
        });
    }
});


module.exports = router;