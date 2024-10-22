import { useEffect, useState } from "react";
import Layout from "./Layout";
import { useRouter } from "next/router";
import axios from "axios";

const ProductForm = ({
  _id,
  title: existingTitle, 
  description: existingDescription, 
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
}:{
  _id?: string;
  title?: string; 
  description?: string; 
  price?: string;
  images?: string;
  category?: string;
}) => {
  const [title, setTitle] = useState<string>(existingTitle || '');
  const [description, setDescription] = useState<string>(existingDescription || '');
  const [price, setPrice] = useState<string>(existingPrice || '');
  const [goToProducts, setGoToProducts] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<string>(assignedCategory || '');
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);
  
  async function saveProduct(event: any) {
    event.preventDefault();
    console.log("_id in update?", _id)
    const data = { title, description, price, category};
    if (_id) {
      //update
      await axios.put("/api/products", {...data, _id});
    } else {
      //create
      await axios.post('/api/post', data);
    }
    // const data = { title, description, price};
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

  async function uploadImages(event: any) {
    const files = event.target?.files;
    console.log(event);
    if (files.length > 0) {
      const data = new FormData();
      for(const file of files) {
        data.append('file', file)
      }
      const res = await fetch('/api/upload', {
        method: "POST",
        body: data,
      });      
    }
    
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input 
        type="text" 
        placeholder="product name" 
        value={title}
        onChange={(event: any) => setTitle(event.target.value)}
      />

      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 && categories.map((c: any, idx: number) => (
          <option value={c._id} key={idx}>{c.name}</option>
        ))}
      </select>
      {/* <label>
        Photos
      </label>
      <div className="mb-2">
        <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm text-gray-500 rounded-md bg-gray-200">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="size-6"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 
              3m0 0 4.5 4.5M12 3v13.5" 
            />
          </svg>
          <div>
            Upload
          </div>
          <input type="file" className="hidden" onChange={uploadImages}/>
        </label>

        {!images?.length && (
          <div>No photos in this product</div>
        )}
      </div> */}

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
        value={price}
        onChange={(event: any) => setPrice(event.target.value)}
      />
      <button 
        type="submit"
        className="btn-primary"
      >Save</button>
    </form>
  )
}

export default ProductForm;