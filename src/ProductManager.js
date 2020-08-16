import React, { useState, useEffect } from 'react';
import { storage } from './firebase/firebase.js';
import Axios from 'axios';

const ProductManager = () => {

  const [imageAsFile, setImageAsFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    getProducts();
  }, [])

  const getProducts = () => {
    Axios
      .get('http://192.168.0.4:8000/admin/api/products')
      .then(response => setProducts(response.data))
      .catch(err => console.error(err));
  }

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image)
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const description = e.target.description.value;
    const price = e.target.price.value;
    // let category = e.target.category.value;
    // if (category === "") {
    //   alert("Please enter a category");
    //   return;
    // }

    setLoading(true);

    console.log('start of upload');

    if (imageAsFile === '') {
      setLoading(false);
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
    };

    let randomizer = (Math.floor(Math.random() * (1000 - 1)) + 1).toString();
    let split = imageAsFile.name.split('.');
    const filename = split[0] + randomizer + split[1];

    const uploadTask = storage.ref(`/products/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('products').child(filename).getDownloadURL()
        .then(fireBaseUrl => {

          let images = [{ filename, fireBaseUrl }]
          let request = { images, name, description, price };

          Axios
            .post('http://192.168.0.4:8000/admin/api/products', request)
            .then(response => {
              getProducts();
              console.log(response)
              setImageAsFile('');
            })
            .catch(err => console.error(err))
        });
    });

    document.getElementById('form-products').reset();
  };

  return (
    <div className="page-products-admin">
      <h2>Products Manager</h2>
      <form id="form-products" className="form-products" onSubmit={handleFireBaseUpload}>
        <h4>Create new item</h4>
        <input className="input-products" type="text" name="name" placeholder="Product Name" />
        <textarea className="input-products" name="description" placeholder="Description" />
        <input className="input-products" type="number" step="0.01" name="price" min="0" placeholder="Price" />
        {/* <select style={{ "height": "24px", "marginBottom": "calc(12px + 0.7vw)" }} name="category">
            <option value="">Select category</option>
            <option value="Prints">Prints</option>
            <option value="Originals">Originals</option>
            <option value="Merchandise">Merchandise</option>
          </select> */}
        <div className="input-products">
          <input
            type="file"
            onChange={handleImageAsFile}
          />
          <button>Upload to Store</button>
        </div>
      </form>
      { products.length ?
        products.map(product => {
          return (
            <div className="row-products">
              <img className="image-products" src={product.images[0].fireBaseUrl} alt="product"></img>
              <div className="details-products">
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>{product.price}</p>
              </div>
            </div>
          )
        }) : null
      }
    </div>
  )
}

export default ProductManager;