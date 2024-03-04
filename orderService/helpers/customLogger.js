exports.customLogger = (req,res,next) => {
    try {

        const timestamp = new Date().toISOString();
        const method = req.method; // HTTPS : POST, GET , PUT , PATCH . DELETE
        const url = req.url; // URL : end point 
        const body = JSON.stringify(req.body, null, 2); // When we convert Obj to String
        
  
        // Log each piece of information on separate lines
        console.log(`[${timestamp}] ${method}`);
        console.log(`URL: ${url}`);
        console.log('Body:');
        console.log(body);
        next()
    }catch(error) {
        console.log('error in Custom Logger',error)
    }
}

exports.apiResponseTime = (req,res,next) => {
    const startTime = new Date();
    res.on('finish',() => {
        const endTime = new Date();
        const executionTime = endTime - startTime; // Time in milliseconds
        console.log('API-Response-Time',executionTime)
    })
    next()
}

// 500ms