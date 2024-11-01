import CustomLabel from "@/components/LabelCustom";
import Layout from "@/components/Layout";
import TitleSection from "@/components/Title";
import { Box, Stack, Table } from "@chakra-ui/react";
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
      <TitleSection title={editedCategory ? `Edit category ${editedCategory.name}` : "Create new category"} />

      <form onSubmit={saveCategory}>
        <Stack className="!grid grid-cols-2 gap-1">
          <Box>
            <CustomLabel name="Category name" />
            <input 
              type="text" 
              placeholder="Category name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />

          </Box>
          
          <Box>
            <CustomLabel name="Category name" />
            <select 
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="pt-3"
            >
              <option value="">No parent category</option>
              {categories.length > 0 && categories
                .filter((category:any) => category._id !== editedCategory?._id) // Exclude the currently edited category
                .map((category:any, idx: number) => (
                  <option value={category._id} key={idx}>{category.name}</option>
                ))}
            </select>
          </Box>
        </Stack>

        <div className="mb-2 mt-5">
          <Box className="grid">
            <CustomLabel name="Properties" />
            <button 
              onClick={addProperty}
              type="button" 
              className="btn-default text-sm mb-2 w-fit mt-2"
            >
              Add new property
            </button>
          </Box>
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
                className="btn-red"
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
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}

          <button 
            type="submit" 
            className="
              bg-green-700/40 
              px-4 
              py-1.5 
              rounded-lg 
              text-white
            "
          >
            Save
          </button>
        </div>

        {!editedCategory && (
          <Table.Root 
            striped 
            size="md" 
            variant={"outline"} 
            className="
              shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] 
              rounded-xl 
              border 
              border-slate-200
              mt-6
            "
          >
            <Table.Header className="bg-primary-gradient">
              <Table.Row>
                <Table.ColumnHeader className="uppercase font-semibold text-slate-500">Category Name</Table.ColumnHeader>
                <Table.ColumnHeader className="uppercase font-semibold text-slate-500">Parent category</Table.ColumnHeader>
                <Table.ColumnHeader></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {categories.length > 0 && categories.map((category:any, idx: number) => (
                <Table.Row key={idx}>
                  <Table.Cell>{category.name}</Table.Cell>
                  <Table.Cell>{category?.parent?.name}</Table.Cell>
                  <Table.Cell>
                    <button
                      type="button"
                      className="btn-default mr-1 !rounded-md"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button 
                      type="button"
                      className="btn-red !rounded-md"
                      onClick={() => deleteCategory(category)}
                    >Delete</button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </form>

    </Layout>
  )
}
export default withSwal(({swal}: any, ref: any) => (
  <Categories swal={swal}/>
));