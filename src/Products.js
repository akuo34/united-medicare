import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const Products = () => {

  const [products, setProducts] = useState([]);
  const [showProduct, setShowProduct] = useState(null);
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [animation, setAnimation] = useState('modal-hidden');

  useEffect(() => {
    Axios
      .get('http://192.168.0.4:8000/admin/api/products')
      .then(response => {
        setProducts(response.data);
        let split = window.location.href.split('/');
        if (split[split.length - 1] !== 'products') {
          let id = split[split.length - 1];

          let product = response.data.filter(product => product._id === id)[0];
          setShowProduct(product);
        } else {
          setShowProduct(null);
        }
      })
      .catch(err => console.error(err));

  }, []);

  const viewProduct = (e) => {
    let _id = e.target.dataset.id;

    window.location = `http://192.168.0.4:3000/products/${_id}`;
  }

  const selectPhoto = (e) => {
    let index = parseInt(e.target.dataset.index);

    setIndex(index);
  }

  const modalHandler = (e) => {
    if (showModal) {
      setAnimation('fadeout');
      setAnimation('modal-hidden');
      setShowModal(false);
      document.body.style.overflow = "auto";
    } else {
      setAnimation('active');
      setShowModal(true);
      document.body.style.overflow = "hidden";
    }
  }

  return (
    <div className="page-admin">
      <div onClick={modalHandler} className={animation === "active" ? "modal active" : `modal ${animation}` } >
        <img onClick={modalHandler} className={animation === "active" ? "modal-image active" : `modal-image ${animation}`} src={showProduct && showProduct.images.length ? showProduct.images[index].fireBaseUrl : null} alt="modal_image" />
        <div className={animation === "active" ? "modal-background" : `modal-background ${animation}` }></div>
      </div>
      <h2 style={{ "marginBottom": "calc(20px + 1vw)" }}>{ showProduct ? "Product Details" : "Products" }</h2>
      <div className="grid">
        {
          !showProduct ?
          products.map((product, index) => {
            return (
              <div className="product-grid">
                <img className="image-grid" data-id={product._id} onClick={viewProduct} src={product.images[0].fireBaseUrl} alt="product" />
                <div className="product-header-price">
                  <h4 data-id={product._id} onClick={viewProduct} className="product-name">{product.name}</h4>
                  <p data-id={product._id} onClick={viewProduct} className="price" style={{ "fontSize": "24px" }}><b>${product.price}</b></p>
                </div>
              </div>
            )
          }) :
          <div className="row-about">
            <div className="column">
              <div className="container-image-about-admin" style={{ "alignSelf": "flexStart", "margin": "0 0 20px 0" }}>
                <img onClick={modalHandler} className="image-about" src={showProduct.images[index].fireBaseUrl} alt="product-view" />
              </div>
              <div className="row" style={{ "flexWrap": "wrap", "justifyContent": "spaceEvenly" }}>
                {
                  showProduct.images.map((image, index) => {
                    return (
                      <div style={{ "height": "75px", "width": "75px", "margin": "0 auto 20px auto" }}>
                        <img data-index={index} onClick={selectPhoto} style={{ "height": "100%", "width": "100%", "objectFit": "cover" }} src={image.fireBaseUrl} alt="product_thumb" />
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className="column" style={{ "maxWidth": "90vw" }}>
              <p className="paragraph-about">
                <b>{showProduct.name}</b>
              </p>
              <p className="paragraph-about">
                <b>Product ID: </b>{showProduct.prodId}
              </p>
              <p className="paragraph-about" style={{ "display": "flex", "alignItems": "flexStart" }}>
                <b>List Price: </b>
                <span style={{ "fontSize": "24px", "marginLeft": "20px", "fontFamily": "helvetica", "fontWeight": "bold" }}>${showProduct.price}</span>
              </p>
              <p className="paragraph-about">
                {showProduct.description}
              </p>
              <p className="paragraph-about" style={{ "marginBottom": "0" }}>
                <b>Features: </b>
              </p>
              <ul className="paragraph-about">
                {
                  showProduct.features.map(feature => {
                    return (
                      <li style={{ "width": "80%" }}>
                        {feature}
                      </li>
                    )
                  })
                }
              </ul>
              <p className="paragraph-about" style={{ "marginBottom": "0" }}>
                <b>Specifications: </b>
              </p>
              <ul className="paragraph-about">
                {
                  showProduct.specs.map(spec => {
                    return (
                      <li style={{ "width": "80%" }}>
                        {spec}
                      </li>
                    )
                  })
                }
              </ul>
              {
                showProduct.downloads.length ?
                <p className="paragraph-about" style={{ "marginBottom": "0" }}>
                  <b>Downloads: </b>
                </p> : null
              }
              <ul className="paragraph-about">
                {
                  showProduct.downloads.map(download => {
                    return (
                      <li style={{ "width": "80%" }}>
                        <a href={download.fireBaseUrl} target="_blank">{download.title}</a>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Products;