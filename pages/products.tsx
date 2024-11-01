import ButtonRef from "@/components/ButtonRef";
import Layout from "@/components/Layout"
import TitleSection from "@/components/Title";
import { ProductListProps } from "@/models/productList.model";
import { Button, Stack, Table, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const products = () => {
  const [products, setProducts] = useState<any>([]);
  const router = useRouter();
  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
      
    })
  }, []);
  return (
    <Layout>
      <TitleSection title="Product list" />

      <Button 
        className="
          text-green-700/80 
          bg-green-700/10 
          px-3 
          p-1 
          rounded-lg 
          text-lg
          hover:bg-green-700/30
          hover:text-white
        "
        onClick={() => router.push('/products/new')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="size-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

        Add new products
      </Button>

      <Stack mt={5}>
        <Table.Root 
          striped 
          size="md" 
          variant={"outline"} 
          className="
            shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] 
            rounded-xl 
            border 
            border-slate-200
          "
        >
          <Table.Header className="bg-primary-gradient">
            <Table.Row>
              <Table.ColumnHeader className="uppercase font-semibold text-slate-500">Product</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {products.map((product:ProductListProps, idx: number) => (
              <Table.Row key={idx}>
                <Table.Cell>{product.title}</Table.Cell>
                <Table.Cell className="flex gap-4">
                  <ButtonRef 
                    href={"/products/edit/"+product._id}
                    icon={ <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="size-4"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 
                            1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 
                            2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" 
                          />
                      </svg>}
                      name="Edit"
                      className="btn-default hover:bg-green-700/40 hover:text-white"
                  />

                  <ButtonRef 
                    href={'/products/delete/'+product._id}
                    icon={ <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="size-4"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 
                        2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 
                        .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 
                        51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" 
                      />
                    </svg>}
                      name="Delete"
                      className="btn-red hover:text-white hover:bg-red-400"
                  />

                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Stack>
    </Layout>
  )
}

export default products;