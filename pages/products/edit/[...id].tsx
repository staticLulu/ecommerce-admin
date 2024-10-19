import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

const EditProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {

 }, [])
  return (
    <Layout>
      edit product from here
    </Layout>
  )
}

export default EditProductPage;