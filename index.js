import dotenv from "dotenv";
dotenv.config();

const { app } = await import("./app.js");

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`⚙️ Server is running at port : ${port}`));
export default app;