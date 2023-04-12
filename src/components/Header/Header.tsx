import React from "react";
import { Button } from "../Button/Button";

export const Header: React.FC<{
  title: string;
  btn?: boolean;
  total?: { data: number };
  onClick?: () => void;
}> = ({ title, btn = true, total, onClick, ...rest }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl">{title}</h2>
        {total && <p>total Amount: {total.data}</p>}
      </div>
      {btn ? (
        <div>
          <Button
            type="button"
            onClick={onClick}
            classes="add-button before:content-['+'] bg-secondary text-primary px-6 py-3"
          >
            <>
              <h6>Add {title}</h6>
            </>
          </Button>
        </div>
      ) : null}
    </div>
  );
};
