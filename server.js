const http = require('http');
const port = 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Proxy Server Running');
  res.end();
});

server.listen(port, (error) => {
  if (error) {
    console.log('Something went wrong', error);
  } else {
    console.log(`Server is listening on port ${port}`);
  }
});
