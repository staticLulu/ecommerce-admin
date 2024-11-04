import LabelCustom from "@/components/LabelCustom";
import Layout from "@/components/Layout";
import TitleSection from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';


function Categories({swal}: any) {
  const [name, setName] = useState<string>('');
  const [categories, setCategories] = useState<any>([]);
  const [parentCategory, setParentCategory] = useState<string>('');
  const [editedCategory, setEditedCategory] = useState<any>(null);
  const [properties, setProperties] = useState<any>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(event: any) {
    event.preventDefault();
    const data = { 
      name, 
      parentCategory, 
      properties: properties.map((p: any) => ({
        name: p.name,
        values: p.values.split(','),
      }))    
    };
    if (editedCategory) {
      await axios.put('/api/categories', {...data,_id:editedCategory._id});
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category: any) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties.map(({name, values}: any) => ({
      name,
      values: values.join(',')
    })));
  }

  function deleteCategory(category: any) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true, // This enables the cancel button
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#ef4444',
      reverseButtons: true
    }).then( async (result: any) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id='+_id);
        fetchCategories();
      }
    });
  }

  function addProperty() {
    setProperties((prev: any) => {
      return [...prev, {name: '', values: ''}]
    })
  }

  function handlePropertyNameChange(index: number, property: string, newName?: string) {
    setProperties((prev: any) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    })
  }

  function handlePropertyValueChange(index: number, property: string, newValues?: string) {
    setProperties((prev: any) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    })
  }

  function removeProperty(indexToRemove: any) {
    setProperties((prev: any) => {
      return [...prev].filter((p: any, idx: number) => {
        return idx !== indexToRemove;
      });
    })
  }

  return (
    <Layout>
      <TitleSection title="Categories" />
      <LabelCustom name={editedCategory ? `Edit category ${editedCategory.name}` : "Create new category"} />

      <form onSubmit={saveCategory} className="grid gap-4">
        <div className="flex gap-1">
          <Input 
            type="text" 
            placeholder="Category name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />

          <Select
            value={parentCategory}
            onValueChange={(value) => setParentCategory(value)} // `onValueChange` returns the value directly
          >
            <SelectTrigger>
              <SelectValue placeholder="No parent category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 && categories.map((category: any) => (
                <SelectItem value={category._id} key={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="grid">
            <LabelCustom name="Properties" />
            <Button 
              onClick={addProperty} 
              type="button" 
              className="w-fit bg-myOldBlue/90 text-myText mb-2 hover:bg-myOldBlue/70"
            >
              Add new property
            </Button>
          </div>

          {properties.length > 0 && properties.map((property: any, idx: number) => (
            <div className="flex gap-2 py-2" key={idx}>
              <Input 
                type="text" 
                value={property.name} 
                onChange={(e) =>handlePropertyNameChange(
                  idx, 
                  property, 
                  e.target.value
                )}
                placeholder="property name (example: color)" 
              />
              <Input 
                type="text" 
                value={property.values} 
                onChange={(e) =>handlePropertyValueChange(
                  idx, 
                  property, 
                  e.target.value
                )}
                placeholder="values, comma separated" 
              />

              <Button 
                onClick={() => removeProperty(idx)}
                className="bg-red-500 hover:bg-red-500/80"
                type="button"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <Button 
              type="submit" 
              className="btn-default py-1"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
            >
              Cancel
            </Button>
          )}

          <Button type="submit" className="bg-myOldBlue/90 hover:bg-myOldBlue/70">
            Save
          </Button>
        </div>

        {!editedCategory && (
          <div className="shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] max-h-[750px] overflow-auto mt-5 rounded-lg">
            <Table>
              <TableHeader className="bg-myOldBlue/90">
                <TableRow>
                  <TableHead className="text-myText uppercase font-bold">Category Name</TableHead>
                  <TableHead className="text-myText uppercase font-bold">Parent category</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {categories.length > 0 && categories.map((category:any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category?.parent?.name}</TableCell>
                    <TableCell className="flex gap-2.5">
                      <Button
                        type="button"
                          className="bg-green-700/20 text-green-700 hover:bg-green-700/10 hover:text-green-400"
                        onClick={() => editCategory(category)}
                      >
                        Edit
                      </Button>
                      <Button 
                        type="button"
                        className="btn-red hover:bg-red-200 hover:text-myText"
                        onClick={() => deleteCategory(category)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </form>

    </Layout>
  )
}
export default withSwal(({swal}: any, ref: any) => (
  <Categories swal={swal}/>
));