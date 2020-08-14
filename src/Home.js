import React from 'react';

const Home = () => {
  return (
    <div className="container-banner">
      <img className="banner" src="/medical_supplies.jpg" alt="sample_banner" />
      <div className="message-banner">
        Partnerships for Health
      </div>
      <button className="button-see-products">View products</button>
    </div>
  )
}

export default Home;