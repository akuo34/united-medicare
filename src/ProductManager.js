import React, { useState, useEffect } from 'react';
import { storage } from './firebase/firebase.js';
import Axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';

const ProductManager = () => {

  const [imageAsFile, setImageAsFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showEdit, setShowEdit] = useState(null);
  const [showFeatures, setShowFeatures] = useState(null);
  const [showSpecs, setShowSpecs] = useState(null);
  const [indexes, setIndexes] = useState({});

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = (id, last) => {
    Axios
      .get('http://192.168.0.4:8000/admin/api/products')
      .then(response => {
        let copy = { ...indexes }

        response.data.forEach(product => {
          if (copy[product._id] === undefined) {
            copy[product._id] = 0;
          } else if (copy[product._id] > product.images.length - 1 && copy[product._id] !== 0) {
            copy[product._id]--;
          } else if (last && id === product._id) {
            copy[id] = product.images.length - 1;
          }
        })

        setIndexes(copy)
        setProducts(response.data);
      })
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
    const prodId = e.target.prodId.value;
    const index = products.length;

    setLoading(true);

    console.log('start of upload');

    if (imageAsFile === '') {
      setLoading(false);
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
      return;
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
          let request = { images, name, prodId, description, price, index };

          Axios
            .post('http://192.168.0.4:8000/admin/api/products', request)
            .then(response => {
              getProducts();
              setImageAsFile('');
              setLoading(false);
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

  const editProductHandler = (e) => {
    e.preventDefault();

    let _id = e.target.dataset.id;
    let name = e.target.name.value;
    let prodId = e.target.prodId.value;
    let description = e.target.description.value;
    let price = e.target.price.value;
    let request = { name, prodId, description, price };

    for (let key in request) {
      if (request[key] === '') {
        delete request[key];
      }
    }

    Axios
      .put(`http://192.168.0.4:8000/admin/api/products/${_id}`, request)
      .then(response => {
        getProducts();
      })
      .catch(err => console.error(err));

    document.getElementById('form-products-edit').reset();
  }

  const deleteHandler = (e) => {
    const _id = e.target.dataset.id;
    const index = parseInt(e.target.dataset.index);

    Axios
      .delete(`http://192.168.0.4:8000/admin/api/products/${_id}`)
      .then(response => {

        products[index].images.forEach(image => {
          storage.ref('products').child(image.filename).delete()
            .then(() => console.log('deleted from firebase'))
            .catch(err => console.error(err));
        })

        for (let i = index + 1; i < products.length; i++) {
          let id = products[i]._id;
          let newIndex = i - 1;

          Axios
            .put(`http://192.168.0.4:8000/admin/api/products/${id}`, { index: newIndex })
            .catch(err => console.error(err));
        }

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

  const addPhoto = (e) => {
    e.preventDefault();

    const _id = e.target.dataset.id;

    console.log('start of upload');
    setLoading(true);

    if (imageAsFile === '') {
      setLoading(false);
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
      return;
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

          let images = products.filter(product => product._id === _id)[0].images;
          images.push({ filename, fireBaseUrl });

          Axios
            .put(`http://192.168.0.4:8000/admin/api/products/${_id}`, { images })
            .then(response => {
              getProducts(_id, true);
              setImageAsFile('');
              setLoading(false);
            })
            .catch(err => console.error(err))
        });
    });

    document.getElementById('form-add-photo').reset();
  }

  const nextPhoto = (e) => {
    let _id = e.target.dataset.id;
    let copy = { ...indexes };
    let images = products.filter(product => product._id === _id)[0].images;

    if (copy[_id] < images.length - 1) {
      copy[_id]++;
      setIndexes(copy);
    }
  }

  const previousPhoto = (e) => {
    let _id = e.target.dataset.id;
    let copy = { ...indexes };

    if (copy[_id] > 0) {
      copy[_id]--;
      setIndexes(copy);
    }
  }

  const deletePhoto = (e) => {
    let _id = e.target.dataset.id;
    let copy = { ...indexes };
    let images = products.filter(product => product._id === _id)[0].images;
    let index = copy[_id];
    let filename = images[index].filename;
    images.splice(index, 1);

    Axios
      .put(`http://192.168.0.4:8000/admin/api/products/${_id}`, { images })
      .then(response => {
        getProducts();

        storage.ref('products').child(filename).delete()
          .then(() => console.log('deleted from firebase'))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  const moveHandler = (e) => {
    let index1 = parseInt(e.target.dataset.index);
    let id1 = products[index1]._id;
    let index2, id2
    let action = e.target.dataset.action;

    if (action === 'up' && index1 !== 0) {
      index2 = parseInt(index1) - 1;
      id2 = products[index2]._id;
    } else if (action === 'down' && index1 !== products.length - 1) {
      index2 = parseInt(index1) + 1;
      id2 = products[index2]._id;
    } else {
      return;
    }

    Axios
      .put(`http://192.168.0.4:8000/admin/api/products/${id1}`, { index: index2 })
      .then(response => {

        Axios
          .put(`http://192.168.0.4:8000/admin/api/products/${id2}`, { index: index1 })
          .then(response => {
            getProducts();
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="page-admin">
      <h2>Products Manager</h2>
      <div className={loading ? "container-loader" : "container-loader hidden"}>
        <PulseLoader
          size={30}
          color={"#363636"}
          loading={loading}
        />
      </div>
      <form id="form-products" className="form-admin" onSubmit={handleFireBaseUpload}>
        <h4>Create new item</h4>
        <input className="input-products" type="text" name="name" placeholder="Product Name" />
        <textarea className="input-products" name="description" placeholder="Description" style={{ "height": "60px" }} />
        <div className="input-products row">
          <input style={{ "width": "40%" }} type="text" name="prodId" placeholder="Product ID" />
          <input style={{ "width": "40%", "justifySelf": "flexEnd", "margin": "0 0 0 auto" }} type="number" step="0.01" name="price" min="0" placeholder="Price" />
        </div>
        <div className="input-products row" style={{ "flexWrap": "wrap" }}>
          <input
            style={{ "marginBottom": "10px" }}
            type="file"
            onChange={handleImageAsFile}
          />
          <button style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto", "height": "21px" }}>Upload Product</button>
        </div>
      </form>
      {products.length ?
        products.map(product => {
          return (
            <div className="row-products">
              <div style={{ "display": "flex", "flexDirection": "column", "maxWidth": "90vw" }}>
                <div className="container-image-products">
                  <img className="image-products" src={product.images.length ? product.images[indexes[product._id]].fireBaseUrl : "/placeholder-image.png"} alt="product"></img>
                </div>
                <form data-id={product._id} id="form-add-photo" onSubmit={addPhoto} className="row">
                  <input
                    style={{ "marginBottom": "10px", "width": "70%" }}
                    type="file"
                    onChange={handleImageAsFile}
                  />
                  <button type="submit" style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto", "height": "21px" }}>Add Photo</button>
                </form>
                <div className="row" style={{ "marginBottom": "20px" }}>
                  <button data-id={product._id} onClick={previousPhoto} style={{ "marginRight": "10px" }}>Previous</button>
                  <button data-id={product._id} onClick={nextPhoto}>Next</button>
                  <span style={{ "justifySelf": "center", "margin": "0 auto" }}>{product.images.length ? (indexes[product._id] + 1) + '/' + product.images.length + ' images' : '0/0 images'}</span>
                  {
                    product.images.length ?
                      <button data-id={product._id} onClick={deletePhoto} style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }}>Delete</button> : null
                  }
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "justifyContent": "spaceEvenly", "width": "850px" }}>
                <div className="details-products">
                  <p><b>Product Name: </b>{product.name}</p>
                  <p><b>Product ID: </b>{product.prodId}</p>
                  <p><b>Description: </b>{product.description}</p>
                  <p><b>Unit Price: </b>${product.price ? product.price.toFixed(2) : null}</p>
                  <div style={{ "display": "flex" }}>
                    <div style={{ "margin": "0 auto 20px 0", "alignSelf": "flexStart" }}>
                      {
                        product.index !== 0 ?
                          <button onClick={moveHandler} data-action="up" data-index={product.index} style={{ "marginRight": "10px" }}>Move Up</button> : null
                      }
                      {
                        product.index !== products.length - 1 ?
                          <button onClick={moveHandler} data-action="down" data-index={product.index} style={{ "marginRight": "10px" }}>Move Down</button> : null
                      }
                    </div>
                    <div style={{ "margin": "0 0 20px auto", "alignSelf": "flexEnd" }}>
                      <button data-id={product._id} onClick={showEditHandler} style={{ "marginRight": "10px" }}>Edit</button>
                      <button data-index={product.index} data-id={product._id} onClick={deleteHandler}>Delete</button>
                    </div>
                  </div>
                  {
                    showEdit === product._id ?
                      <form id="form-products-edit" data-id={product._id} onSubmit={editProductHandler} style={{ "display": "flex", "flexDirection": "column" }}>
                        <input style={{ "marginBottom": "10px" }} type="text" name="name" placeholder="Product Name" />
                        <input style={{ "marginBottom": "10px" }} type="text" name="prodId" placeholder="Product ID" />
                        <textarea style={{ "marginBottom": "10px", "height": "60px", "fontFamily": "Arial" }} name="description" placeholder="Description" />
                        <input style={{ "marginBottom": "20px" }} type="number" step="0.01" name="price" min="0" placeholder="Price" />
                        <button type="submit" style={{ "margin": "0 0 20px auto", "alignSelf": "flexEnd" }}>Submit Changes</button>
                      </form> :
                      null
                  }
                </div>
                <div className="details-products">
                  <div style={{ "marginBottom": "10px", "display": "flex" }}>
                    <div>
                      <b>Features: </b>{product.features.length + ' features'}
                    </div>
                    <div style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }}>
                      {
                        showFeatures !== product._id && product.features.length ?
                          <button data-id={product._id} onClick={showFeaturesHandler}>Show</button> : null
                      }
                      {
                        showFeatures === product._id && product.features.length ?
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
                        <input style={{ "width": "80%" }} type="text" name="feature" placeholder="Feature" required></input>
                        <button style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }} type="submit">Add</button>
                      </form> : null
                  }
                  <div style={{ "marginBottom": "10px", "marginTop": "10px", "display": "flex" }}>
                    <div>
                      <b>Specs: </b>{product.specs.length + ' specs'}
                    </div>
                    <div style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }}>
                      {
                        showSpecs !== product._id && product.specs.length ?
                          <button data-id={product._id} onClick={showSpecsHandler}>Show</button> : null
                      }
                      {
                        showSpecs === product._id && product.specs.length ?
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
                        <input style={{ "width": "80%" }} type="text" name="spec" placeholder="Spec" required></input>
                        <button style={{ "justifySelf": "flexEnd", "margin": "0 0 0 auto" }} type="submit">Add</button>
                      </form> : null
                  }
                </div>
              </div>
            </div>
          )
        }) : null
      }
    </div>
  )
}

export default ProductManager;