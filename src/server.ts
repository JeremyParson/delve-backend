import app from "./app";
import setupIO from "./io";

const server = setupIO(app);
const port = Number(process.env.IO_PORT);
server.listen(port);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}.`);
});
