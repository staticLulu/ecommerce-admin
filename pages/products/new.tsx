import Layout from "@/components/Layout"
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const NewProduct = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [goToProducts, setGoToProducts] = useState<boolean>(false);
  const router = useRouter();

  async function createProduct(event: any) {
    event.preventDefault();
    const data = { title, description, price};
    await axios.post('/api/products', data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setGoToProducts(true);
  }

  if(goToProducts) {
    router.push("/products");
  }

  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>

        <label>Product name</label>
        <input 
          type="text" 
          placeholder="product name" 
          value={title}
          onChange={(event: any) => setTitle(event.target.value)}
          />

        <label>Description</label>
        <textarea 
          placeholder="description" 
          value={description}
          onChange={(event: any) => setDescription(event.target.value)}
        />
        <label>Price (in USD)</label>
        <input 
          type="number" 
          placeholder="price" 
          onChange={(event: any) => setPrice(event.target.value)}
        />
        <button 
          type="submit"
          className="btn-primary"
        >Save</button>
      </form>
    </Layout>
  )
}

export default NewProduct;