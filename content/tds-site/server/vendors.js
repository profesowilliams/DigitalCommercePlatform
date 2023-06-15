function prepareVendorsDataResponse() {
    let vendorsData = {
        "content": {
            "items": 
[
 {
   "vendor-name": "Acer",
   "vendor-title": "Acer",
   "vendor-abbreviation": "acer",
   "vendor-designation": "TRUE",
   "overview": "<h1>Lorem ipsum</h1>",
   "vendor-icon": "svg:blah",
   "Solutions": "experience-fragments:variation/web,experience-fragments:variation/pinterest",
   "vendor-category": "properties:orientation/square,properties:orientation/portrait",
   "vendor-product-label": "Browse Products by Acer",
   "vendor-product-link": "shop-url"
 },
 {
   "vendor-name": "hpe",
   "vendor-title": "Hewlett Packard Enterprise",
   "vendor-abbreviation": "hpe",
   "vendor-designation": "FALSE",
   "overview": "Lorem Ipsum",
   "vendor-icon": "svg:blah",
   "Solutions": "properties:orientation/square,properties:orientation/portrait",
   "vendor-category": "experience-fragments:variation/web,experience-fragments:variation/pinterest",
   "vendor-product-label": "Browse Products by HP",
   "vendor-product-link": "shop-url"
 },
 {
    "vendor-name": "3Mobile",
    "vendor-title": "3Mobile",
    "vendor-abbreviation": "3mob",
    "vendor-designation": "TRUE",
    "overview": "Lorem ipsum",
    "vendor-icon": "svg:blah",
    "Solutions": "experience-fragments:variation/web,experience-fragments:variation/pinterest",
    "vendor-category": "properties:orientation/square,properties:orientation/portrait",
    "vendor-product-label": "Browse Products by 3Mobile",
    "vendor-product-link": "shop-url"
  }
]
}
}

    return vendorsData;
}



module.exports = {
    vendorsJsonData : prepareVendorsDataResponse
}
