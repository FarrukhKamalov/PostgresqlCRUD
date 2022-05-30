const express = require("express");
const app = express();
const {Pool} = require('pg');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const pool = new Pool({
    connectionString: 'postgres://postgres:admin@localhost:5432/courses'
})
app.get('/', async(req,res)=>{
    try{
        const client = await pool.connect()
        const query = await client.query('SELECT * FROM books ORDER BY book_id'); 
        res.json({success: "OK", data: query.rows});
        client.release()
    }catch(err){
        console.log(err)
    }
})
app.post('/', async(req,res)=>{
    try{
        const client = await pool.connect()
        const {rows} = await client.query('INSERT INTO books(book_name) VALUES($1)', [req.body.name]); 
        res.json({success: "OK", data: rows});
        client.release()
    }catch(err){
        console.log(err)
    }
})

app.put("/:id", async(req,res)=>{
    try {
        const {name} = req.body;
        const client = await pool.connect();
        const query = await client.query(`UPDATE books SET book_name = $1 book_id = $2`, [name, req.params.id])
        res.json({success: 'ok'});
        client.release()
    } catch (error) {
        console.log(error)
    }
})

app.get("/:id", async(req,res)=>{
    try {
        const client = await pool.connect();
        const query = await client.query(`SELECT * FROM books WHERE book_id = $1`, [req.params.id])
        res.json({success: 'ok', data: query.rows});
        client.release()
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.PORT || 4000, ()=>{
    console.log('http://localhost:4000')
})