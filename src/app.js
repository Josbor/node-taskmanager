import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, PORT } from '../config.js';
import express  from 'express';
import mysql from 'mysql'
import cors from 'cors'



var app = express();

app.use(express.json());
app.use(cors());

// establecemos los parametros
var conexion = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database:DB_NAME

})

//probamos la conexion
conexion.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log('conexion exitosa')
    }
})


app.get('/', (req, res) => {
    res.send('ruta INICIO')
})

app.get('/api/tareas', (req, res) => {
    conexion.query('SELECT * FROM tareas', (error, rows) => {
        if (error) {
            throw error;
        } else {
            res.send(rows)
        }
    })
});

app.get('/api/tareas/:id', (req, res) => {
    conexion.query('SELECT * FROM tareas WHERE id=?', req.params.id, (error, row) => {
        if (error) {
            throw error;
        } else {
            res.send(row)
        }
    })
});


app.post('/api/tareas', (req, res) => {
    let data = {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed
    }


    let sql = "INSERT INTO tareas SET ?"
    conexion.query(sql, data, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.send(results)
        }
    })
});

app.delete('/api/tareas/:id', (req, res) => {
    let id = req.params.id

    let sql = `DELETE FROM tareas WHERE id=?`
    conexion.query(sql, id, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.send(results)
        }
    })
});



app.put('/api/tareas/:id', (req, res) => {
    let { name, description, completed } = req.body
    let id = req.params.id

    let sql = `UPDATE tareas SET name='${name}',description='${description}',completed='${completed ? 1 : 0}' WHERE id='${id}'`
    conexion.query(sql, (error, results) => {
        if (error) {
            throw error;
        } else {
            res.send(results.affectedRows ? {id,name,description,completed} : 0)
        }
    })
});

app.listen(PORT, () => {
    console.log('servidor levantado en el puerto: '+PORT);
})
