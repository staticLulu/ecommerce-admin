import Layout from "@/components/Layout"
import { useEffect } from "react";

const OrdersPage = () => {

  useEffect(() => {
    
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>

      <table className="basic">
        <thead>
          <tr>
            <th>ID</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </Layout>
  )
}

export default OrdersPage;