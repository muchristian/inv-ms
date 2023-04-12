import React from "react";
import { Button } from "../Button/Button";

interface props {
  title: string;
  classes?: string;
  price: number;
  image?: string;
  onAddToCart?: () => void;
}

export const Product: React.FC<props> = ({
  title,
  price,
  classes,
  image,
  onAddToCart,
}) => {
  return (
    <div
      className={`w-full max-w-sm bg-primary border border-text/10 rounded ${classes}`}
    >
      <a href="#">
        <img
          className="p-8 rounded-t-lg"
          src={image ? image : "/no-image.jpg"}
          alt="product image"
        />
      </a>
      <div className="px-5 pb-5 flex flex-col gap-2">
        <a href="#">
          <h5 className="text-medium font-bold tracking-tight text-text/80">
            {title}
          </h5>
        </a>
        <div className="flex items-center justify-between">
          <div className="flex justify-between">
            <div>
              <span className="text-sm font-bold text-danger">
                ${price} RFW
              </span>
            </div>
            <div></div>
          </div>

          <Button
            type="button"
            classes="text-primary bg-secondary hover:bg-secondary-800 focus:ring-4 focus:outline-none focus:ring-secondary-300 font-medium rounded text-sm px-4 py-2 text-center"
            onClick={onAddToCart}
          >
            <>Add to cart</>
          </Button>
        </div>
      </div>
    </div>
  );
};
