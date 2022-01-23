import React, { useState, useEffect } from "react";
import "./App.css";

const ProductDisplay = ({ price }) => (
  <section className="mb-2">
    <div className="product">
      <img
        src={price.product.images[0]}
        alt="The cover of Stubborn Attachments"
      />
      <div className="description">
        <h3>{price.product.name}</h3>
        <h5>RM {(price.unit_amount / 100).toFixed(2)}</h5>
      </div>
    </div>
    <form action={`/create-checkout-session?priceId=${price.id}`} method="POST">
      <button type="submit" className="bg-gradient-to-r from-sky-500 to-indigo-500">
        Checkout
      </button>
    </form>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [prices, setPrices] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // const p = fetch('/get-all-products', {
    //   headers: {
    //     Accept: 'application/json',
    //   },
    // })
    fetch('/get-all-products', {
      headers: {
        Accept: 'application/json',
      }
    })
      .then(res => {
        return res.json()
      })
      .then((data) => {
        if (data) {
          setPrices(data);
        }
        return
      })
  }, [])

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    prices.map((price) => (<ProductDisplay price={price} />))
  );
}