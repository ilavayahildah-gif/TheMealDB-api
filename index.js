require("./src/index.ts");

Socket.on("stockUpdate", (meal)=>{
    console.log("Stock changed:", meal);
});