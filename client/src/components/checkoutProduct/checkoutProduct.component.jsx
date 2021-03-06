import React from "react";

// import { ReactComponent as EarthIcon } from "../../assets/icons/earth.svg";
// import { ReactComponent as planeIcon } from "../../assets/icons/airplane-outline.svg";

import Button from "../button/button.component";

import "./checkoutProduct.styles.scss";

const CheckoutProduct = ({ type, product }) => {
  return (
    <div className="checkout__product">
      <div className="itemBox__photo">
        {!product ? (
          <div>
            <p>
              Please add a <span>{type}</span>
            </p>
          </div>
        ) : (
          <div>
            <img
              src={`/${product?.collectionThumb}`}
              alt={`checkout item ${product.title}`}
            />
          </div>
        )}
      </div>
      <div className="itemInfo">
        <h2 className="itemBox__name">
          {product?.title || type.toUpperCase()}
        </h2>
        <h3 className="itemBox__price">
          <span>{product?.price ? "$" : ""}</span>
          {product?.price || "-"}
        </h3>
      </div>
      <div className="itemBtns">
        {!product ? (
          ""
        ) : (
          <Button
            content={[
              {
                type:
                  product.category === "planets"
                    ? "removePlanet"
                    : "removeStarship",
                text: "remove",
                itemToDispatch: product,
              },
            ]}
          />
        )}
        <Button
          content={[
            {
              type: "link",
              text: `${!product ? "add" : "change"}`,
              linkTo: `/${type}s`,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default CheckoutProduct;
