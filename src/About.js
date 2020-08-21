import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const About = () => {

  const [about, setAbout] = useState(null);

  useEffect(() => {
    Axios
      .get('http://192.168.0.4:8000/admin/api/about')
      .then(response => setAbout(response.data[0]))
      .catch(err => console.error(err));

  }, []);

  return (
    <div className="page-admin">
      <h2>About the company</h2>
      <div className="row-about" style={{ "marginTop": "calc(20px + 1vw)" }}>
        <div className="column">
          {
            about ?
            about.images.map(image => {
              return (
                <div className="container-image-about">
                  {
                    about ?
                      <img className="image-about" src={image.fireBaseUrl} alt="about" /> : null
                  }
                </div>
              )
            }) : null
          }
        </div>
        <p className="paragraph-about" style={{ "lineHeight": "26px" }}>
          {
            about ?
              about.about : null
          }
        </p>
      </div>
    </div>
  )
}

export default About;