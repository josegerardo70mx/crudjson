const http = require('http');
const PORT = 8000;
const fs = require('fs/promises');
const path = require('path')

//CRUD server
// crud server con archivo json como bae de datos

// CRUD DE USUARIOS EN EL BACKEND

// atendiendo las diferentes rutas de crud
// si fuera una ruta diferente respoder no disponible

const app = http.createServer(async(request, response)=>{
  const url = request.url;
  const method = request.method;
  const jsonPath = path.resolve('./files/todos.json');
  if(url === '/users'){
    // iniciaremos con el get de usuarios del archivo users.json
    if(method === 'GET'){
      //Leer el archivo y responder con la informacion del archivo
      const jsonFile = await fs.readFile(jsonPath, 'utf-8');
      response.setHeader('Content-Type', 'application/json');
      response.write(jsonFile);
    }
    //CREANDO USUARIOS
    const jsonFile = await fs.readFile(jsonPath, 'utf-8');
    const usersArray = JSON.parse(jsonFile)
    if(method === 'POST'){
      // primero vamos a necesitar leer la informacion
      request.on('data', (data) => {
        //el json tengo que convertirlo en arreglo o objeto
        const user = JSON.parse(data);
        //leer el archivo users.json
        usersArray.push(user);
        const newJson = JSON.stringify(usersArray);
        fs.writeFile(jsonPath, newJson);
      })
    }
    if(method === 'PUT'){
      request.on('data',(data)=>{
        const userToEdit = JSON.parse(data);
        // console.log(userToEdit.name, usersArray[0].name);
        for(let i = 0; i<usersArray.length; i++){
          if(userToEdit.name === usersArray[i].name){
            usersArray.splice(i,1,userToEdit);
            const newJson = JSON.stringify(usersArray);
            fs.writeFile(jsonPath,newJson);
          }
        }
          })
        }
    if(method === 'DELETE'){
      request.on('data',(data)=>{
        const userToDelete = JSON.parse(data);
        for(let i = 0; i<usersArray.length; i++){
          if(userToDelete.name === usersArray[i].name){
            usersArray.splice(i,1);
            const newJson = JSON.stringify(usersArray);
            fs.writeFile(jsonPath,newJson);
          }
        }
      })
    }
    //actualizar usuario y eliminar usuario
  } else {
    response.write('Recurso no disponible')
  }
  response.end();
})
app.listen(PORT);
console.log(`Servidor escuhando en el puerto ${PORT}`)