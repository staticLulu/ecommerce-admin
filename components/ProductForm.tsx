import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

const ProductForm = ({
  _id,
  title: existingTitle, 
  description: existingDescription, 
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
}: {
  _id?: string;
  title?: string; 
  description?: string; 
  price?: string;
  images?: any;
  category?: string;
}) => {
  const [title, setTitle] = useState<string>(existingTitle || '');
  const [description, setDescription] = useState<string>(existingDescription || '');
  const [price, setPrice] = useState<string>(existingPrice || '');
  const [goToProducts, setGoToProducts] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(assignedCategory || '');
  const [images, setImages] = useState<any[]>(existingImages || []);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [productProperties, setProductProperties] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }, []);
  
  async function saveProduct(event: any) {
    event.preventDefault();
    const data = { title, description, price, category, images, productProperties }; // Add images to the data
    if (_id) {
      // Update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // Create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  } 

  async function uploadImages(event: any) {
    const files = event.target?.files;
    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });
        
        const result = await res.json();
        console.log('Upload result:', result); // Log the full response
        
        // Check if the result has a url property
        if (result?.url) {
          setImages((oldImages: any[]) => [...oldImages, result.url]); // Update images with the new URL
        } else {
          console.error('Invalid response format or no url found.');
        }
        setIsUploading(false);
      } catch (err) {
        console.error('Error uploading image:', err);
      }
    }
  }

  function uploadImagesOrder(images: any) {
    setImages(images)
  }

  function setProductProp(propName: string, value: any) {
    setProductProperties((prev: any) => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    })
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo.parent?.id) {
      const parentCat = categories.find(({_id}) => _id === category);
      propertiesToFill.push(parentCat.properties);
      catInfo = parentCat;
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

      {propertiesToFill.length > 0 && propertiesToFill.map((p: any, idx: number) => (
        <div key={idx}>
          <div>{p.name}</div>
          <select 
            value={productProperties[p.name]} 
            onChange={(e) => setProductProp(p.name, e.target.value)}
          >
            {p.values.map((v: any, idx: number) => (
              <option value={v} key={idx}>{v}</option>
            ))}
          </select>
        </div>
      ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable list={images} setList={uploadImagesOrder} className="flex flex-wrap gap-1">
          {!!images.length && images.map((url: string, idx: number) => (
            <div key={idx} className="inline-block h-24">
              <img 
                src={url} 
                alt={`Product image ${idx + 1}`} 
                className="rounded-lg" // Add any styling you need
              />
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 bg-gray-200 flex p-1 items-center">
            <Spinner />
          </div>
        )}

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
      </div>


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
  );
}

export default ProductForm;
