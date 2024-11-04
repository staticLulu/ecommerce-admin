import Layout from "@/components/Layout"
import TitleSection from "@/components/Title";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState<any>([]);

  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data)
    });
  }, []);

  return (
    <Layout>
      <TitleSection title="Order list" />
      <div className="shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] max-h-[750px] overflow-auto mt-5 rounded-lg">
        <Table>
          <TableHeader className="bg-myOldBlue/90">
            <TableRow>
              <TableHead className="text-myText uppercase font-bold">Date</TableHead>
              <TableHead className="text-myText uppercase font-bold">Paid</TableHead>
              <TableHead className="text-myText uppercase font-bold">Recipient</TableHead>
              <TableHead className="text-myText uppercase font-bold">Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 && orders.map((order: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{(new Date(order.createdAt)).toLocaleDateString()}</TableCell>
                <TableCell 
                  className={order.paid ? "text-green-500" : "text-red-500"}
                >
                  {order.paid ? 'YES' : 'NO'}
                </TableCell>
                <TableCell>
                  {order.name} {order.email} <br />
                  {order.city} {order.postalCode} {order.country} <br />
                  {order.streetAddress}
                </TableCell>
                <TableCell>
                  {order.line_items.map((l: any, idx: number) => (
                    <div key={idx}>
                      {l.price_data.product_data?.name} x {l.quantity}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

export default OrdersPage;