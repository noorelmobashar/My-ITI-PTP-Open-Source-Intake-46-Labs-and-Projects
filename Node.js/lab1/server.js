const http = require("http");
const fs = require("fs").promises;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/students") {

      const data = await fs.readFile("students.json", "utf-8").then(data => JSON.parse(data)).catch(error => {
        res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({"message": "Not Found"}));
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));

    } else if (req.url === "/stats") {

      const data = await fs.readFile("students.json", "utf-8").then(data => JSON.parse(data)).catch(error => {
        res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({"message": "Not Found"}));
      });
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        "total_students": data.length
      }));

    } else if (req.url === "/courses") {

      const data = await fs.readFile("students.json", "utf-8").then(data => JSON.parse(data)).catch(error => {
        res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({"message": "Not Found"}));
      });      
      
      const courses = [...new Set(data.map(student => student.course))];
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
          "courses": courses
      }));
    } else if(req.url.startsWith("/students?search")){
      const nameQuery = req.url.split("?search=")[1];
      const data = await fs.readFile("students.json", "utf-8").then(data => JSON.parse(data)).catch(error => {
        res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({"message": "Not Found"}));
      });      
      const students = data.filter((student) => student.name.toLowerCase().includes(nameQuery.toLowerCase()));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(students));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({"message": "Not Found"}));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({"message": "Internal Server Error"}));
  }

  //logging request
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} ${res.statusCode}`);
  
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});