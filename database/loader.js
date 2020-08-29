const fs = require('fs');
const { aboutItem, productItem } = require('./');

aboutItem.deleteMany({}, () => {
  console.log('deleted about');

  fs.readFile('database/data/aboutData.csv', (err, data) => {
    if (err) {
      throw err;
    } else {
      let array = data.toString().split('\n');

      if (!array[array.length - 1]) {
        array.pop();
      }

      array.forEach(item => {
        let object = JSON.parse(item);
        aboutItem.create(object)
          .catch(err => console.error(err));
      })
      console.log('uploaded to about');
    }
  })
});

productItem.deleteMany({}, () => {
  console.log('deleted products');

  fs.readFile('database/data/productData.csv', (err, data) => {
    if (err) {
      throw err;
    } else {
      let array = data.toString().split('\n');

      if (!array[array.length - 1]) {
        array.pop();
      }

      array.forEach(item => {
        let object = JSON.parse(item);
        productItem.create(object)
          .catch(err => console.error(err));
      })
      console.log('uploaded to products');
    }
  })
});



