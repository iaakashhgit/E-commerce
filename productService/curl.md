curl --location --request POST 'http://localhost:3000/api/v1/createProduct' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name":"NoiseFit Twist Go",
    "description":"The NoiseFit Twist Go is a smartwatch with a round dial, metal build, and a rotating crown for navigation.",
    "discountedPrice":"1299",
    "discountPercent" : "40%",
    "actualPrice" : "2165",
    "stock":"100",
    "category":"Smart Watch",
    "sellerId":"seller123",
    "images" : [
        {
        "caption" : "sideImage",
        "url" : "https://www.gonoise.com/cdn/shop/files/Twist-Go-GN-Carousel-black-1_ce50d4a5-d8d3-4bb7-85e1-b9e8cdb518a8.png?v=1709117060"
        }
    ],
    "videos" : [
        {
        "caption" : "featuresVideo",
        "url" : "https://www.gonoise.com/cdn/shop/files/Twist-Go-GN-Carousel-black-1_ce50d4a5-d8d3-4bb7-85e1-b9e8cdb518a8.png?v=1709117060"
        }
    ]
}'


curl --location --request POST 'http://localhost:3000/api/v1/getProducts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "isFilter" : true,
    "filterObj" : {
        "name" :"NoiseFit Twist Go"
    }
}'


curl --location --request DELETE 'http://localhost:3000/api/v1/delete?productId=c351783a-471e-4a50-91af-8cf721bed94b' \
--header 'Content-Type: application/json' \
--data-raw ''


curl --location --request PUT 'http://localhost:3000/api/v1/update?productId=90eebc80-9698-4b17-a62d-4b463ad777d4' \
--header 'Content-Type: application/json' \
--data-raw '{
    "updateObject" : {
        "stock" : "300"
    },
    "images" : [
        {
            "caption" : "right",
            "url" : "https://www.gonoise.com/cdn/shop/files/Twist-Go-GN-Carousel-black-1_ce50d4a5-d8d3-4bb7-85e1-b9e8cdb518a8.png?v=1709117060"
        }
    ]
}'


curl --location --request POST 'http://localhost:8080/api/v1/createOrder' \
--header 'Content-Type: application/json' \
--data-raw '{
    "productId" : "27420980-9ca3-47eb-a3d0-e66993ae5003",
    "quantity" : 100,
    "userId" : "xyz"
}'