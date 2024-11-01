import Layout from "@/components/Layout"
import { Table } from "@chakra-ui/react";
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
      <h1>Orders</h1>

      <Table.Root
        striped 
        size="md" 
        variant={"outline"} 
        className="
          shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] 
          rounded-xl 
          border 
          border-slate-200
          mt-6
        "
      >
        <Table.Header className="bg-primary-gradient">
          <Table.Row>
            <Table.ColumnHeader className="uppercase font-semibold text-slate-500">Date</Table.ColumnHeader>
            <Table.ColumnHeader className="uppercase font-semibold text-slate-500">Paid</Table.ColumnHeader>
            <Table.ColumnHeader className="uppercase font-semibold text-slate-500">Recipient</Table.ColumnHeader>
            <Table.ColumnHeader className="uppercase font-semibold text-slate-500">Products</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orders.length > 0 && orders.map((order: any, idx: number) => (
            <Table.Row key={idx}>
              <Table.Cell>{(new Date(order.createdAt)).toLocaleDateString()}</Table.Cell>
              <Table.Cell 
                className={order.paid ? "text-green-500" : "text-red-500"}
              >
                {order.paid ? 'YES' : 'NO'}
              </Table.Cell>
              <Table.Cell>
                {order.name} {order.email} <br />
                {order.city} {order.postalCode} {order.country} <br />
                {order.streetAddress}
              </Table.Cell>
              <Table.Cell>
                {order.line_items.map((l: any, idx: number) => (
                  <div key={idx}>
                    {l.price_data.product_data?.name} x {l.quantity}
                  </div>
                ))}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Layout>
  )
}

export default OrdersPage;