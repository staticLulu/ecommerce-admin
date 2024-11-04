import Layout from "@/components/Layout";
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
import { ExternalLinkIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { MyAlertDialog } from "@/components/MyAlertDialog";

const Products = () => {
  const [products, setProducts] = useState<ProductListProps[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
    });
  }, []);

  // Function to handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    try {
      await axios.delete(`/api/products?id=${productId}`);
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Layout>
      <TitleSection title="Product list" />

      <Button 
        variant="secondary" 
        className="bg-myOldBlue/90 text-myText"
        onClick={() => router.push('/products/new')} 
      >
        <PlusIcon />
        Add new product
      </Button>

      <div 
        className="shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] max-h-[750px] overflow-auto mt-5 rounded-lg"
      >
        <Table>
          <TableHeader className="bg-myOldBlue/90">
            <TableRow>
              <TableHead className="text-myText uppercase font-bold">Product name</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell className="flex gap-2.5">
                  <Button 
                    variant="outline"
                    className="bg-green-700/20 text-green-700 hover:bg-green-700/10 hover:text-green-400"
                    onClick={() => router.push(`/products/edit/${product._id}`)}
                  >
                    <ExternalLinkIcon />
                    Edit
                  </Button>

                  <MyAlertDialog
                    triggerLabel="Delete"
                    title="Are you absolutely sure?"
                    description="This action cannot be undone. This will permanently delete this product and remove your data from our servers."
                    onConfirm={() => handleDeleteProduct(product._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default Products;
