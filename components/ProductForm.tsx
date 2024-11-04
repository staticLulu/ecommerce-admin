import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UploadIcon } from "@radix-ui/react-icons";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import LabelCustom from "./LabelCustom";

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
      <div className="w-full !grid md:grid-cols-2 gap-4">
        <div>
          <LabelCustom name="Product name" />
          <Input 
            placeholder="Product name" 
            type="text" 
            value={title} 
            onChange={(e: any) => setTitle(e.target.value)} 
          />
        </div>

        <div className="grid">
          <LabelCustom name="Category" />
          <Select
            value={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Uncategorized" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 && categories.map((c, idx) => (
                <SelectItem value={c._id} key={idx}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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

      <div className="grid md:grid-cols-2 gap-5 mt-4">
        <div>
          <LabelCustom name="Photos" />
          <div className="mb-2 flex flex-wrap gap-1">
            <ReactSortable 
              list={images} 
              setList={uploadImagesOrder} 
              className="flex flex-wrap gap-1"
            >
              {!!images.length && images.map((url: string, idx: number) => (
                <div key={idx} className="h-32 w-32 p-4 shadow-sm rounded-sm border border-gray-200">
                  <img 
                    src={url} 
                    alt={`Product image ${idx + 1}`} 
                    className="rounded-lg w-[180px] h-[180px] object-cover object-center"
                  />
                </div>
              ))}
            </ReactSortable>
            {isUploading && (
              <div className="h-32 w-32 bg-gray-200 !flex p-1 items-center justify-center">
                <Spinner />
              </div>
            )}

            <Label 
              className="
                w-32
                h-32 
                cursor-pointer 
                text-center 
                flex 
                items-center 
                justify-center 
                text-base
                text-myOldBlue/90
                rounded-lg 
                bg-white 
                shadow-sm 
                border 
                border-myOldBlue/10
                flex-col
              "
            >
              <UploadIcon width={28} height={28} />
              Add image
              <input type="file" className="hidden" onChange={uploadImages}/>
            </Label>
          </div>
        </div>
        <div>
          <LabelCustom name="Description" />
          <Textarea 
            placeholder="Type your message here." 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
      </div>

      <div className="mt-4">
        <LabelCustom name="Price (in USD)" />
        <input 
          type="number" 
          placeholder="price" 
          value={price}
          onChange={(event: any) => setPrice(event.target.value)}
          className="rounded-lg"
        />
      </div>
     
     <div className="flex gap-2 mt-5 justify-end">
      <Button 
        type="button" 
        className="
          bg-transparent
          hover:bg-myOldBlue/10
          border
          border-slate-300
          px-4 
          py-1 
          text-slate-500 
        "
        onClick={() => router.back()}
      >
        Cancel
      </Button>

      <Button 
        type="submit" 
        className="
          bg-myOldBlue/90 
          hover:bg-myOldBlue/60 
          px-4 
          py-1 
          text-myText 
        "
      >
        Save
      </Button>
     </div>
    </form>
  );
}

export default ProductForm;
