import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import TitleSection from "@/components/Title";

const NewProduct = () => {
  return (
    <Layout>
      <TitleSection title="New Product" />
      <ProductForm/>
    </Layout>
  )
}

export default NewProduct;