const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
};

async function createHandler (req, res) {
    const baseDir = path.join(__dirname, '.');
  
    let url = req.url;
    let method = req.method;
  
    let ext = path.extname(url);
    let contentType = mimeTypes[ext] || 'application/octet-stream';
  
    console.log(url, method);
  
    if (((url === '/index.html') || (url === '/')) && method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      let resEnd = fs.readFileSync("src/pages/index.html", 'utf8');
      res.end(resEnd);
      return;
    }
    
    if ((url === '/api/search') && method === 'POST'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const searchText = data.text;
                
                // search 
                const searchResult = await require('./search.js').search(searchText);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(searchResult));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    }

    if ((url === '/api/all') && method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const allProducts = await require('./showAll.js').showAll();
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(allProducts));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    }

    if ((url === '/api/card') && method === 'POST'){
        
    }

    if ((url.startsWith('/api/card')) && method === 'GET') {
        const urlObj = new URL(url, `http://${req.headers.host}`);
        const id = urlObj.searchParams.get('id');
        
        try {
            const response = await fetch(`https://dummyjson.com/products/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const product = await response.json();
            
            // Создаем HTML страницу
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${product.title}</title>
                    <link rel="stylesheet" href="src/css/card.css">
                </head>
                <body>
                    <div id="card-container">
                        ${require('./showCard.js').showCard(product)}
                    </div>
                </body>
                </html>
            `;
            
            console.log(html); 

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
            return;
        } catch (error) {
            console.error('Ошибка в обработчике /api/card:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Ошибка при загрузке данных продукта');
            return;
        }
    }

    try {
      if (url !== '/' && method === 'GET') {
        let filePath = path.join(baseDir, url);
        let fileContent = fs.readFileSync(filePath, 'utf8');

        if (ext === '.html') {
             res.setHeader('Content-Type', 'text/html; charset=utf-8');
        } else {
             res.setHeader('Content-Type', contentType);
        }

        res.statusCode = 200;
        res.end(fileContent);
        return;
      }
    }
    catch (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(fs.readFileSync(path.join(baseDir, 'pages/404.html'), 'utf8'));
      return;
    }
}

module.exports = createHandler;



