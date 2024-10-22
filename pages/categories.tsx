import Layout from "@/components/Layout";
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
      properties    
    };
    if (editedCategory) {
      await axios.put('/api/categories', {...data,_id:editedCategory._id});
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    fetchCategories();
  }

  function editCategory(category: any) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  function deleteCategory(category: any) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true, // This enables the cancel button
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete',
      confirmButtonColor: '#d55',
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
      <h1>Categories</h1>
      <label>{editedCategory ? `Edit category ${editedCategory.name}` : "Create new category"}</label>

      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input 
            type="text" 
            placeholder="Category name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />

          {/* <select 
            className="mb-0" 
            value={parentCategory}
            onChange={(e) =>setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 && categories.map((category:any, idx: number) => (
              <option value={category._id} key={idx}>{category.name}</option>
            ))}
          </select> */}
          <select 
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 && categories
              .filter((category:any) => category._id !== editedCategory?._id) // Exclude the currently edited category
              .map((category:any, idx: number) => (
                <option value={category._id} key={idx}>{category.name}</option>
              ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block">Properties</label>
          <button 
            onClick={addProperty}
            type="button" 
            className="btn-default text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 && properties.map((property: any, idx: number) => (
            <div className="flex gap-1 mb-2" key={idx}>
              <input 
                type="text" 
                value={property.name} 
                className="mb-0"
                onChange={(e) =>handlePropertyNameChange(
                  idx, 
                  property, 
                  e.target.value
                )}
                placeholder="property name (example: color)" 
              />
              <input 
                type="text" 
                value={property.values} 
                className="mb-0"
                onChange={(e) =>handlePropertyValueChange(
                  idx, 
                  property, 
                  e.target.value
                )}
                placeholder="values, comma separated" 
              />

              <button 
                onClick={() => removeProperty(idx)}
                className="btn-default"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-1">
          {editedCategory && (
            <button 
              type="submit" 
              className="btn-default py-1"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
              }}
            >
              Cancel
            </button>
          )}

          <button 
            type="submit" 
            className="btn-primary py-1"
          >
            Save
          </button>
        </div>

        {!editedCategory && (
          <table className="basic mt-4">
            <thead>
              <tr>
                <td>Category Name</td>
                <td>Parent category</td>
                <td></td>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 && categories.map((category:any, idx: number) => (
                <tr key={idx}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="btn-primary mr-1"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => deleteCategory(category)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </form>

    </Layout>
  )
}
export default withSwal(({swal}: any, ref: any) => (
  <Categories swal={swal}/>
));