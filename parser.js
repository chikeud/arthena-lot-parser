/*
 * @author: Chike Udenze
 * @since: 01/04/2018
 */
let $ = require('cheerio');
let fs = require('fs');


let firstFileList = ['./data/2015-03-18/lot1.html', './data/2015-03-18/lot2.html','./data/2015-03-18/lot3.html','./data/2015-03-18/lot4.html','./data/2015-03-18/lot5.html'];
let secondFileList = ['./data/2017-12-20/lot1.html','./data/2017-12-20/lot2.html','./data/2017-12-20/lot3.html','./data/2017-12-20/lot4.html','./data/2017-12-20/lot5.html'];
let finalList = [];
/**
 * Parsing in all the files from the 2015-03-18 structure into the initial list of objects
 */
for (i = 0; i < firstFileList.length; i++) {
  let htmlString = fs.readFileSync(firstFileList[i]).toString();
  let parsedHTML = $.load(htmlString);

  let artistName = "";
  //Getting Artist Name from h2 tag
  parsedHTML('h2').map(function(i, artist){

    artist = $(artist);
    artistName = artist.text();

  });
  //Getting work title from h3 tag
  let title = parsedHTML('h3').text().replace("Price realised", '');
  let currency = "";
  let amount = "";
  //Getting Price & currency from div tags
  parsedHTML('div').map(function(i, price){
    price = $(price);

    if(price.text().split(" ")[0] == "USD" ){
      currency = price.text().split(" ")[0];
      amount = price.text().split(" ")[1].split(",").join('');
      amount = Number(amount);

    }
    else if(price.text().split(" ")[0] == "GBP"){
      currency = "USD";
      amount = (price.text().split(" ")[1].split(",").join('') * 1.34).toFixed(2);
      amount = Number(amount);

    }

  });
  //Building Artist Object
  let object = {
    "artist": artistName,
    "totalValue": 0,
    "works": [
      {"title": title,
      "currency": currency,
      "totalLifetimeValue": amount}
    ]
  };
  //pushing artist object to the final list that is being printed out
  finalList.push(object);

}
/**
 * Parsing in all the files from the 2017-12-20 structure into the is already existing list of structures
 */
for (i = 0; i < secondFileList.length; i++) {
  let htmlString = fs.readFileSync(secondFileList[i]).toString();
  let parsedHTML = $.load(htmlString);

  parsedHTML('.artist').map(function(i, artist){

    artist = $(artist);
    //checking for picasso to update artist object
    if(artist.text() == "Pablo Picasso (1881-1973)"){
      for (i = 0; i < finalList.length; i++){
        if(finalList[i].artist == "Pablo Picasso"){
          let initial = parsedHTML('h3').text().replace("Price", '');
          let title = initial.replace("Pablo Picasso (1881-1973)", '');
          let currencyString = parsedHTML('span').text().replace("USD",'');
          let currency = currencyString.split(",").join('');
          currency = Number(currency);
          let object = {
            "title": title,
            "currency": "USD",
            "totalLifetimeValue": currency
          };
          finalList[i].works.push(object);
        }

      }

    }
    //checking for Marcoussis to update artist object
    else if(artist.text() == "Louis Marcoussis (1883-1941)"){
      for(i = 0; i <finalList.length; i++){
        if(finalList[i].artist == "Louis Marcoussis (1883-1941)"){
          let initial = parsedHTML('h3').text().replace("Price", '');
          let title = initial.replace("Louis Marcoussis (1883-1941)", '');
          let currencyString = parsedHTML('span').text().replace("USD", '');
          let currency = currencyString.split(",").join('');
          currency = Number(currency);
          let object = {
            "title": title,
            "currency": "USD",
            "totalLifetimeValue": currency
          };

          finalList[i].works.push(object);
        }
      }

    }
    //checking for van Rijn to update artist object
    else if(artist.text() == "Rembrandt Harmensz. van Rijn"){
      for(i = 0; i <finalList.length; i++){
        if(finalList[i].artist == "Rembrandt Harmensz. van Rijn"){
          let initial = parsedHTML('h3').text().replace("Price", '');
          let title = initial.replace("Rembrandt Harmensz. van Rijn", '');
          let currencyString = parsedHTML('span').text().replace("USD", '');
          let currency = currencyString.split(",").join('');
          currency = Number(currency);
          let object = {
            "title": title,
            "currency": "USD",
            "totalLifetimeValue": currency
          };

          finalList[i].works.push(object);
        }
      }
    }
  });
}
//removing years of birth and death
for(i = 0; i <finalList.length; i++){
  let totalValue = 0;
  if(finalList[i].artist == "Louis Marcoussis (1883-1941)"){
    finalList[i].artist = "Louis Marcoussis";
  }
  for(j = 0; j < finalList[i].works.length; j++){
    totalValue += finalList[i].works[j].totalLifetimeValue;

  }
  finalList[i].totalValue = "USD " + totalValue.toString();




}
//printing out the stringified object
console.log(JSON.stringify(finalList));




