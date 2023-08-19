let express=require("express");
let app=express();
app.use(express.json());
let {open}=require("sqlite");
let sqlite3=require("sqlite3");
let path=require("path");
let requiredPath=path.join(__dirname,"");
const initializeDbAndServer= async ()=>{
    try{
    dp= await open({
        filename:requiredPath,
        driver:sqlite3.Database
    });
    app.listen(3000,()=>{
        return "initialize is successful"
    });
   }
   catch(e){
       return `${e.message}`
   }

}
initializeDbAndServer();
const caseConvert=(movie)=>{
    {movie_id,director_id,movie_name,lead_actor}=movie;
    return ({
        "movieId":movie-id,
        "directorId":director_id,
        "movieName":movie_name,
        "leadActor":lead_actor

    });
};
const caseConvertInDirector=(director)=>{
    const {director_id,director_name}=director;
    return {
        "directorId":director_id,
        "directorName":director_name
    }
}
app.get("/movies/",async(request,response)=>{
    const query=`
    SELECT *
    FROM Movie Table;
    `;
    let data=await db.all(query);
    response.send(data.map((movie) =>caseConvert(movie)));
});
app.post("/movies/",async (request,response)=>{
    const {movieId}=request.params;
    const  {directorId,movieName,leadActor}=request.body;
    const query=`INSERT INTO Movie table(director_id,movie_name,lead_actor)
    VALUES(${directorId},
    `${movieName}`,
    `${leadActor}`);
    `;
    await db.run(query);
    response.send("Movie Successfully Added");
});
app.get("/movies/:movieId/",(request,response)=>{
    let {movieId}=request.params;
    const query=`
    SELECT *
    FROM Movie Table 
    WHERE movie_id=${movieId};
    `;
    let data=db.all(query);
    response.send(data.map((movie) =>caseConvert(movie)));
});
app.put("/movies/:movieId/",(request,response)=>{
    let {movieId}=request.params;
    const tableData=request.body;
    const {directorId,movieName,leadActor}=tableData;
    const query=`
    UPDATE Movie Table
    SET 
    "director_id"=${directorId},
    "movie_name"=`${movieName}`,
    "lead_actor"=`${leadActor}`, 
    WHERE movie_id=${movieId};
    `;
    let data=db.all(query);
    response.send("Movie Details Update");
});
app.delete("/movies/:movieId/",(request,response)=>{
    let {movieId}=request.params;
    const query=`
    DELETE FROM Movie Table
     
    WHERE movie_id=${movieId};
    `;
    let data=db.run(query);
    response.send("Movie Removed");
});
app.get("/directors/",(request,response)=>{
    let {movieId}=request.params;
    const query=`
    SELECT * FROM Director Table
      `;
    let data=db.all(query);
    response.send(data.map((movie) =>caseConvertInDirector(movie)));
});
app.get("/directors/:directorId/movies/",(request,response)=>{
    let {movieId}=request.params;
    const query=`
    SELECT * FROM Director Table
    WHERE movie_id=${movieId};
      `;
    let data=db.run(query);
    response.send(data.map((movie) =>caseConvertInDirector(movie)));
});
module.exports=app;