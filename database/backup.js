const fs = require('fs');
const { aboutItem, productItem } = require('./');

const backup = () => {
  let wStreamAbout = fs.createWriteStream('database/data/aboutData.csv');
  let wStreamProduct = fs.createWriteStream('database/data/productData.csv');
  
  aboutItem.find()
    .then(response => {
      response.forEach(item => {
        wStreamAbout.write(JSON.stringify(item) + '\n');
      })
      console.log('backed up about')

      productItem.find()
        .then(response => {
          response.forEach(item => {
            wStreamProduct.write(JSON.stringify(item) + '\n');
          })
          console.log('backed up products');
          return;
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
  
  
}

backup();
