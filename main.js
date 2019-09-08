//modules
const request = require('request');

//config(will make a .json file later)
let category = "Accessories";
let keyword = "Tagless";
let size = "Small";
let color = "White";

//session for cookies
const session = request.defaults({jar:true});

//function to find ids
function productSearch(category, keyword, size, color){
    //status for user
    console.log('searching for product...')
    
    //options for get request to the stock of supreme
    const optionsFindId = {
        url: 'https://www.supremenewyork.com/mobile_stock.json',
        method: 'GET',
        headers: {
            'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
        }
    };

    //get request to supreme stock
    session(optionsFindId, function(err, res, body){
        //looping through category and finding product corresponding with keyword
        let jsonMobileStock  = JSON.parse(body);
        for(var i in jsonMobileStock['products_and_categories'][category]){
            
            if(jsonMobileStock['products_and_categories'][category][i]['name'].includes(keyword)){
                
                console.log("product found")
                
                let id  =  jsonMobileStock['products_and_categories'][category][i]['id'];
                
                //options for get request to specific id json
                const optionsFindStyleId = {
                    url: 'https://www.supremenewyork.com/shop/' + id + '.json',
                    method: 'GET',
                    headers: {
                        'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
                    }
                };

                //get request to the specific id json
                session(optionsFindStyleId, function(err, res, body){
                    //looping through the colors and sizes to find styleId
                    let jsonMobileStyle = JSON.parse(body);
                    for(var j in jsonMobileStyle['styles']){
                        if(color == jsonMobileStyle['styles'][j]['name']){
                            let styleId = jsonMobileStyle['styles'][j]['id'];
                            //looping through the colors and sizes to find sizeId
                            for(var t in jsonMobileStyle['styles'][j]['sizes']){
                                if(size == jsonMobileStyle['styles'][j]['sizes'][t]['name']){
                                    let sizeId = jsonMobileStyle['styles'][j]['sizes'][t]['id'];
                                    addToCart(id, styleId, sizeId);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                });
                break;
            }
        }
    });
}

//add to cart function
function addToCart(id, styleId, sizeId){
    //status for user
    console.log("attempting to add to cart")

    //options for add to cart request
    const optionsAddToCart = {
        url: 'https://www.supremenewyork.com/shop/' + id + '/add.json',
        method: 'POST',
        headers: {
            'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
        },
        form: {
            's':sizeId,
            'st':styleId,
            'qty':1
        }
    }

    //post request for add to cart
    session(optionsAddToCart, function(err, res, body){
        if(200 == res.statusCode){
            console.log("added to cart")
        }
    });
}

productSearch(category, keyword, size, color);