import Layout from "@/components/Layout"
import TitleSection from "@/components/Title";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ProductListProps } from "@/models/productList.model";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ExternalLinkIcon } from "@radix-ui/react-icons"

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
        variant={"secondary"} 
        className="bg-green-700/20 text-green-700"
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
        Add new product
      </Button>

      <div 
        className="
          shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] 
          max-h-[750px] 
          overflow-auto 
          mt-5 
          rounded-lg
        "
      >
        <Table>
          <TableHeader className="bg-green-700/20">
            <TableRow>
              <TableHead className="text-green-700 uppercase bg">Product name</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product:ProductListProps, idx: number) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="flex gap-2.5">
                  <Button 
                    variant={"outline"}
                    className="
                      bg-green-700/20
                      text-green-700
                      hover:bg-green-700/10
                      hover:text-green-400
                    " 
                    onClick={() => { router.push(`/products/edit/${product._id}`)}}
                  >
                    <ExternalLinkIcon />
                    Edit
                  </Button>

                  <Button 
                    variant={"outline"}
                    className="
                      bg-red-400/60 
                      text-red-700 
                      hover:bg-red-400/30 
                      hover:text-red-400
                    " 
                    onClick={() => { router.push(`/products/delete/${product._id}`)}}
                  >
                    <ExternalLinkIcon />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  )
}

export default products;