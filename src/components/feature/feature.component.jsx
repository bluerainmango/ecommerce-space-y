import React, { useRef, useEffect } from "react";
import featureImg from "../../assets/planet1-feature1.jpeg";
import { ReactComponent as Point } from "../../assets/point-right.svg";

import "./feature.styles.scss";

const Feature = ({ planet }) => {
  const contentRef = useRef();

  useEffect(() => {
    const contentDOM = contentRef.current;
    const featureTextArr = contentDOM.querySelectorAll(".feature__context");

    console.log("🍧", contentDOM.querySelectorAll(".feature__context"));

    const option = {
      root: null,
      threshold: 0,
      //   rootMargin: "20% 20% 20% 20%",
    };

    const featureAnim = (entries, observer) => {
      const [entry] = entries;

      if (!entry.isIntersecting) return;

      console.log("🍝", entry.target.querySelector("h3"));
      entry.target.classList.add("feature-anim");
    };

    const textObserver = new IntersectionObserver(featureAnim, option);

    featureTextArr?.forEach((el) => {
      textObserver.observe(el);
    });

    // contentObservers?.forEach((el) => el.observe(contentDOM));
  }, [contentRef]);

  return (
    <section className="feature">
      <div
        className="feature__img"
        style={{ backgroundImage: `url(${featureImg})` }}
      >
        {/* <img src={featureImg} /> */}
      </div>
      <div ref={contentRef} className="feature__content">
        {planet?.feature.map((el, i) => {
          return (
            <div className="feature__context" key={`feature-${i}`}>
              <Point />
              {/* <svg className="feature__icon">
                <use xlink:href="../../assets/point-right.svg" />
              </svg> */}
              <div>
                <h3>{el.subject}</h3>
                <p>{el.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Feature;
