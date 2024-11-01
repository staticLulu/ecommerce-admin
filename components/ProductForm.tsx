import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { Box, HStack, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field"
import CustomLabel from "./LabelCustom";

const ProductForm = ({
  _id,
  title: existingTitle, 
  description: existingDescription, 
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}: {
  _id?: string;
  title?: string; 
  description?: string; 
  price?: string;
  images?: any;
  category?: string;
  properties?: string;
}) => {
  const [title, setTitle] = useState<string>(existingTitle || '');
  const [description, setDescription] = useState<string>(existingDescription || '');
  const [price, setPrice] = useState<string>(existingPrice || '');
  const [goToProducts, setGoToProducts] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(assignedCategory || '');
  const [images, setImages] = useState<any[]>(existingImages || []);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [productProperties, setProductProperties] = useState<any>(assignedProperties || {});
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }, []);
  
  async function saveProduct(event: any) {
    event.preventDefault();
    const data = { title, description, price, category, images, properties:productProperties }; // Add images to the data
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

  const propertiesToFill: any[] = []; // Initialize propertiesToFill as an empty array
    if (categories.length > 0 && category) {
      let catInfo = categories.find(({ _id }) => _id === category); // Find the category object with matching _id

      // Ensure catInfo and catInfo.properties are defined before spreading
      if (catInfo?.properties?.length > 0) {
        propertiesToFill.push(...catInfo.properties);
      }

      // Loop through parent categories, if any
      while (catInfo?.parent?.id) {
        const parentCat = categories.find(({ _id }) => _id === catInfo.parent.id); // Find the parent category

        // Ensure parentCat and parentCat.properties are defined before spreading
        if (parentCat?.properties?.length > 0) {
          propertiesToFill.push(...parentCat.properties);
        }
        catInfo = parentCat; // Update catInfo to point to the parent category
      }
    }


  return (
    <form 
      onSubmit={saveProduct} 
      className="
        p-5 
        bg-white 
        rounded-lg 
        shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]
      "
    >
      <Stack className="w-full !grid grid-cols-2">
        <Box>
          <CustomLabel name="Product name" />
          <input 
            type="text" 
            placeholder="product name" 
            value={title}
            onChange={(event: any) => setTitle(event.target.value)}
            className="!mb-0 rounded-lg"
          />
        </Box>

        <Box className="grid">
          <CustomLabel name="Category" />
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="pt-3 rounded-lg"
          >
            <option value="">Uncategorized</option>
            {categories.length > 0 && categories.map((c: any, idx: number) => (
              <option value={c._id} key={idx}>{c.name}</option>
            ))}
          </select>
        </Box>
      </Stack>

      {propertiesToFill.length > 0 && propertiesToFill.map((p: any, idx: number) => (
        <div key={idx}>
          <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
          <div>
            <select 
              value={productProperties[p.name]} 
              onChange={(e) => setProductProp(p.name, e.target.value)}
            >
              {p.values.map((v: any, idx: number) => (
                <option value={v} key={idx}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <CustomLabel name="Photos" />
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable 
          list={images} 
          setList={uploadImagesOrder} 
          className="flex flex-wrap gap-1"
        >
          {!!images.length && images.map((url: string, idx: number) => (
            <div key={idx} className="h-24 p-4 shadow-sm rounded-sm border border-gray-200">
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

        <label 
          className="
            w-24 
            h-24 
            cursor-pointer 
            text-center 
            flex 
            items-center 
            justify-center 
            text-sm 
            text-green-700/60
            rounded-lg 
            bg-white 
            hover:bg-green-700/20
            hover:text-white
            shadow-sm 
            border 
            border-green-700/20
            flex-col
          "
        >
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
            Add image
          </div>
          <input type="file" className="hidden" onChange={uploadImages}/>
        </label>
      </div>

      <CustomLabel name="Description" />
      <textarea 
        placeholder="description" 
        value={description}
        onChange={(event: any) => setDescription(event.target.value)}
        className="rounded-lg"
      />
      <CustomLabel name="Price (in USD)" />
      <input 
        type="number" 
        placeholder="price" 
        value={price}
        onChange={(event: any) => setPrice(event.target.value)}
        className="rounded-lg"
      />
      <button 
        type="submit"
        className="
          bg-green-700/40 
          hover:bg-green-700/20 
          px-3 
          py-1 
          rounded-md 
          text-white 
          text-base
          flex 
          justify-self-end
          mt-4
        "
      >
        Save
      </button>
    </form>
  );
}

export default ProductForm;
