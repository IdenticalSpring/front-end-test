import { Carousel } from "antd";
import blankImage from "../assets/images/slider-1-slide-1-1920x671.jpg";
import football from "../assets/images/football.png"
import football1 from "../assets/images/12.png"

const Slideshow = () => {
  const images = [
    football,football1,football,football1,football
  ];

  return (
    <Carousel autoplay dotPosition="bottom" className="carousel-fullwidth">
      {images.map((src, index) => (
        <div key={index} className="carousel-slide">
          <img style={{ width: "100%", height: "500px" }} src={src} alt={`Slide ${index + 1}`} className="carousel-image" />
        </div>
      ))}
    </Carousel>
  );
};

export default Slideshow;
