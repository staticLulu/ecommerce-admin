import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import TitleSection from "@/components/Title";
import { Text } from "@chakra-ui/react";

const NewProduct = () => {
  return (
    <Layout>
      <TitleSection title="New Product" />
      <ProductForm/>
    </Layout>
  )
}

export default NewProduct;