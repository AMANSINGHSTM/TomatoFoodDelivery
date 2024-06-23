import { useContext, useEffect } from 'react';
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from "../../context/StoreContext"
import axios from 'axios';
const Verify = () => {

    const [searchParms, setSearchParams] = useSearchParams();
    const success = searchParms.get("success")
    const orderId = searchParms.get("orderId")
    const { url } = useContext(StoreContext)
    const navigate = useNavigate()

    const VerifyPayment = async () => {
        const response = await axios.post(url + "/api/order/verify", { success, orderId })
        console.log(response)
        if (response.data.success) {
            navigate('/myOrders')
        }
        else {
            navigate('/')
        }
    }

    useEffect(() => {
        VerifyPayment()
    }, [])

    return (
        <div className='verify'>
            <div className='spinner'></div>
            Verify
        </div>
    )
}

export default Verify