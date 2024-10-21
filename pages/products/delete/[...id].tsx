import Layout from "@/components/Layout"
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DeleteProductPage = () => {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState<any>();
  const { id } = router.query;

  useEffect(() => {
    if(!id) {
      return;
    }
    axios.get("/api/products?id="+id).then(response => {
      setProductInfo(response.data);
    });

  }, [id]);

  async function deleteProduct() {
    try {
      await axios.delete(`/api/products?id=${id}`);
      goBack();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
  
  function goBack() {
    router.push("/products");
  }
  return (
    <Layout>
      <h1 className="text-center">do you want to delete &nbsp;"{productInfo?.title}"?</h1>

      <div className="flex gap-2 justify-center">
        <button 
          className="btn-red"
          onClick={deleteProduct}
        >
          Yes
        </button>
        <button 
          className="btn-default" 
          onClick={goBack}
        >
          No
        </button>
      </div>
    </Layout>
  )
}

export default DeleteProductPage;