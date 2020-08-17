import React, { useState, useEffect } from 'react';
import { storage } from './firebase/firebase.js';
import Axios from 'axios';

const ProductManager = () => {

  const [imageAsFile, setImageAsFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showEdit, setShowEdit] = useState(null);
  const [showFeatures, setShowFeatures] = useState(null);
  const [showSpecs, setShowSpecs] = useState(null);

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

  const showEditHandler = (e) => {
    const _id = e.target.dataset.id;

    if (showEdit === _id) {
      setShowEdit(null);
    } else {
      setShowEdit(_id);
    }
  }

  const deleteHandler = (e) => {
    const _id = e.target.dataset.id;

    Axios
      .delete(`http://192.168.0.4:8000/admin/api/products/${_id}`)
      .then(response => {

        let images = products.filter(product => product._id === _id)[0].images;

        images.forEach(image => {
          storage.ref('products').child(image.filename).delete()
            .then(() => console.log('deleted from firebase'))
            .catch(err => console.error(err));
        })

        console.log(response);
        getProducts();
      })
      .catch(err => console.error(err));
  }

  const addFeature = (e) => {
    e.preventDefault();

    let feature = e.target.feature.value;
    let _id = e.target.dataset.id;
    let features = products.filter(product => product._id === _id)[0].features;

    features.push(feature);

    Axios
      .put(`http://192.168.0.4:8000/admin/api/products/${_id}`, { features })
      .then(response => {
        console.log(response)
        getProducts();
        setShowFeatures(_id);
      })
      .catch(err => console.error(err));

    document.getElementById('form-features').reset();
  }

  const deleteFeature = (e) => {
    let _id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let features = products.filter(product => product._id === _id)[0].features;

    features.splice(index, 1);

    Axios
      .put(`http://192.168.0.4:8000/admin/api/products/${_id}`, { features })
      .then(response => {
        console.log(response)
        getProducts();
      })
      .catch(err => console.error(err));
  }

  const showFeaturesHandler = (e) => {
    let _id = e.target.dataset.id;

    if (showFeatures === _id) {
      setShowFeatures(null);
    } else {
      setShowFeatures(_id);
    }
  }

  const addSpec = (e) => {
    e.preventDefault();

    let spec = e.target.spec.value;
    let _id = e.target.dataset.id;
    let specs = products.filter(product => product._id === _id)[0].specs;

    specs.push(spec);

    Axios
      .put(`http://192.168.0.4:8000/admin/api/products/${_id}`, { specs })
      .then(response => {
        console.log(response)
        getProducts();
        setShowSpecs(_id);
      })
      .catch(err => console.error(err));

    document.getElementById('form-specs').reset();
  }

  const deleteSpec = (e) => {
    let _id = e.target.dataset.id;
    let index = e.target.dataset.index;
    let specs = products.filter(product => product._id === _id)[0].specs;

    specs.splice(index, 1);

    Axios
      .put(`http://192.168.0.4:8000/admin/api/products/${_id}`, { specs })
      .then(response => {
        console.log(response)
        getProducts();
      })
      .catch(err => console.error(err));
  }

  const showSpecsHandler = (e) => {
    let _id = e.target.dataset.id;

    if (showSpecs === _id) {
      setShowSpecs(null);
    } else {
      setShowSpecs(_id);
    }
  }

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
            style={{ "marginBottom": "10px" }}
            type="file"
            onChange={handleImageAsFile}
          />
          <button>Upload Product</button>
        </div>
      </form>
      {products.length ?
        products.map(product => {
          return (
            <div className="row-products">
              <div className="container-image-products">
                <img className="image-products" src={product.images[0].fireBaseUrl} alt="product"></img>
              </div>
              <div className="details-products">
                <p><b>Product Name: </b>{product.name}</p>
                <p><b>Description: </b>{product.description}</p>
                <p><b>Unit Price: </b>${product.price ? product.price.toFixed(2) : null}</p>
                <div style={{ "margin": "0 0 20px auto", "alignSelf": "flexEnd" }}>
                  {/* <button style={{ "marginRight": "10px" }}>Add Features</button> */}
                  {/* <button style={{ "marginRight": "10px" }}>Add Specs</button> */}
                  <button data-id={product._id} onClick={showEditHandler} style={{ "marginRight": "10px" }}>Edit</button>
                  <button data-product={product} data-id={product._id} onClick={deleteHandler}>Delete</button>
                </div>
                {
                  showEdit === product._id ?
                    <div style={{ "display": "flex", "flexDirection": "column" }}>
                      <input style={{ "marginBottom": "10px" }} type="text" name="name" placeholder="Product Name" />
                      <textarea style={{ "marginBottom": "10px", "height": "60px" }} name="description" placeholder="Description" />
                      <input style={{ "marginBottom": "20px" }} type="number" step="0.01" name="price" min="0" placeholder="Price" />
                      <button style={{ "margin": "0 0 20px auto", "alignSelf": "flexEnd" }}>Submit Changes</button>
                    </div> :
                    null
                }
                <div style={{ "marginBottom": "10px", "display": "flex" }}>
                  <div>
                    <b>Features: </b>{product.features.length + ' features'}
                  </div>
                  <div style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }}>
                    {
                      showFeatures !== product._id ?
                        <button data-id={product._id} onClick={showFeaturesHandler}>Show</button> : null
                    }
                    {
                      showFeatures === product._id ?
                        <button data-id={product._id} onClick={showFeaturesHandler} style={{ "marginLeft": "10px" }}>Hide</button> : null
                    }
                  </div>
                </div>
                {product.features.length && showFeatures === product._id ?
                  <ul style={{ "marginTop": "0" }}>
                    {
                      product.features.map((feature, index) => {
                        return (
                          <div style={{ "display": "flex", "marginBottom": "10px" }}>
                            <li style={{ "width": "80%" }}>{feature}</li>
                            <button data-id={product._id} data-index={index} onClick={deleteFeature} style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto", "height": "21px" }}>Delete</button>
                          </div>
                        )
                      })
                    }
                  </ul> : null
                }
                {
                  product.features.length === 0 || showFeatures === product._id ?
                    <form id="form-features" onSubmit={addFeature} data-id={product._id} style={{ "display": "flex", "width": "100%", "marginBottom": "10px", "marginTop": "10px" }}>
                      <input style={{ "width": "80%" }} type="text" name="feature" placeholder="Feature"></input>
                      <button style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }} type="submit">Add</button>
                    </form> : null
                }
                <div style={{ "marginBottom": "10px", "marginTop": "10px", "display": "flex" }}>
                  <div>
                    <b>Specs: </b>{product.specs.length + ' specs'}
                  </div>
                  <div style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }}>
                    {
                      showSpecs !== product._id ?
                      <button data-id={product._id} onClick={showSpecsHandler}>Show</button> : null
                    }
                    {
                      showSpecs === product._id ?
                      <button data-id={product._id} onClick={showSpecsHandler} style={{ "marginLeft": "10px" }}>Hide</button> : null
                    }
                  </div>
                </div>
                {product.specs.length && showSpecs === product._id ?
                  <ul style={{ "marginTop": "0" }}>
                    {
                      product.specs.map((spec, index) => {
                        return (
                          <div style={{ "display": "flex", "marginBottom": "10px" }}>
                            <li style={{ "width": "80%" }}>{spec}</li>
                            <button data-id={product._id} data-index={index} onClick={deleteSpec} style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto", "height": "21px" }}>Delete</button>
                          </div>
                        )
                      })
                    }
                  </ul> : null
                }
                {
                  product.specs.length === 0 || showSpecs === product._id ?
                    <form id="form-specs" onSubmit={addSpec} data-id={product._id} style={{ "display": "flex", "width": "100%", "marginBottom": "20px", "marginTop": "10px" }}>
                      <input style={{ "width": "80%" }} type="text" name="spec" placeholder="Spec"></input>
                      <button style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }} type="submit">Add</button>
                    </form> : null
                }
              </div>
            </div>
          )
        }) : null
      }
    </div>
  )
}

export default ProductManager;