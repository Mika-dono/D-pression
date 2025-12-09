const sql=require('mssql');
const config=require('./dbconfig');
async function connectandquery(){
    try{
        let pool=await sql.connect(config);
        let result=await pool.request().query("SELECT * FROM Ultimate_db");
        console.log(result.recordsets);
    }
    catch(error){
        console.log('error is',JSON.stringify(error,null,2));
    }
    finally{
        await sql.close();
    }

}
connectandquery();