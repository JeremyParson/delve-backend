import { PrismaClient } from "@prisma/client";

const NODE_ENV = process.env.NODE_ENV;
let url = "";
if (NODE_ENV == "testing") {
  url = process.env.TESTING_DATABASE_URL
} else {
  url = process.env.DATABASE_URL
}
console.log("connecting to", url)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url
    }
  }
});

export default prisma;
