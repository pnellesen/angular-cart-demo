var http = require('http');
var fs = require('fs');
var path = require('path'); 
var url = require('url'); 

// Create a server
http.createServer( function (request, response) {  
   // Parse the request containing file name
   var pathname = url.parse(request.url).pathname;
   
   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   
   // Read the requested file content from file system
   fs.readFile(pathname.substr(1), function (err, data) {
      if (err) {
         console.log(err);
         // HTTP Status: 404 : NOT FOUND
         // Content Type: text/plain
         response.writeHead(404, {'Content-Type': 'text/html'});
      }else {	
    	  console.log("found file " + pathname);
    	  var fileName = path.basename(request.url);
    	  console.log("filename: " + fileName);
    	  var ext = path.extname(fileName);
    	  console.log("extension: " + ext);
    	  var extensions = {
    				".html" : "text/html",
    				".css" : "text/css",
    				".js" : "application/javascript",
    				".json" : "application/json",
    				".png" : "image/png",
    				".gif" : "image/gif",
    				".jpg" : "image/jpeg"
    			};
    	  
    		if(!extensions[ext]){
    			//for now just send a 404 and a short message
    			res.writeHead(404, {'Content-Type': 'text/html'});
    			res.end("&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;The requested file type is not supported&lt;/body&gt;&lt;/html&gt;");
    		};
         //Page found	  
         // HTTP Status: 200 : OK
         // Content Type: text/plain
         response.writeHead(200, {'Content-Type': extensions[ext]});
         
         if (extensions[ext].indexOf('image') >= 0) {
        	 response.end(data, 'binary');// Need to return images as binary data rather then text
         } else {
             // Write the content of the file to response body
             response.write(data.toString());		        	 
         }
         
         

      }
      // Send the response body 
      response.end();
   });   
}).listen(4242);

// Console will print the message
console.log('Server running at http://127.0.0.1:4242/');