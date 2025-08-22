"use client";

import { useState } from "react";
import { createMachine } from "xstate";

const toggleMachine = createMachine({
  id: "quantityToggle",
});

export function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (quantity: number) => {
    if (quantity == 0) return;
    setQuantity(quantity);
  };

  return (
    <div className="flex flex-row space-x-4">
      <button
        className="cursor-pointer w-10 rounded-md h-10 bg-gray-200 active:bg-gray-300"
        onClick={() => handleQuantityChange(quantity - 1)}
      >
        -
      </button>
      <input
        className="w-10"
        value={quantity.toString()}
        onChange={(e) => {
          handleQuantityChange(parseInt(e.target.value));
        }}
      />
      <button
        className="cursor-pointer w-10 rounded-md h-10 bg-gray-200 active:bg-gray-300"
        onClick={() => handleQuantityChange(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
