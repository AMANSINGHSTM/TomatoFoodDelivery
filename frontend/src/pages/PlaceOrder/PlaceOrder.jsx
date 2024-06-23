import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""

  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }




  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)

      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
    // console.log(response)
    if (response.data.success) {
      const { session_url } = response.data;
      console.log(session_url)
      window.location.replace(session_url)
    }
    else {
      alert("Error")
    }



  }

  useEffect(() => {
    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input onChange={onChangeHandler} name="firstName" value={data.firstName} type="text"
            placeholder="First name" required />
          <input onChange={onChangeHandler} name="lastName" value={data.lastName} type="text"
            placeholder="Last name" required />
        </div>
        <input onChange={onChangeHandler} name="email" value={data.email} type="text"
          placeholder="Email address" required />
        <input onChange={onChangeHandler} name="street" value={data.street} type="text"
          placeholder="Street" required />

        <div className="multi-fields">
          <input onChange={onChangeHandler} name="city" value={data.city} type="text"
            placeholder="City" required />
          <input onChange={onChangeHandler} name="state" value={data.state} type="text"
            placeholder="State" required />
        </div>
        <div className="multi-fields">
          <input onChange={onChangeHandler} name="zipcode" value={data.zipcode} type="text"
            placeholder="Zip code" required />
          <input onChange={onChangeHandler} name="country" value={data.country} type="text"
            placeholder="Country" required />
        </div>
        <input onChange={onChangeHandler} name="phone" value={data.phone} type="text"
          placeholder="Phone" required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p> ${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;





