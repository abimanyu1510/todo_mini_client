import React,{useState,useEffect} from "react";

function Todo() {
const [title,setTitle]=useState("");
const [description,setDescription]=useState("");
const [todos,setTodos]=useState([]);
const [error,setError]=useState("");
const [message,setMessage]=useState("");
const [editId,setEditId]=useState(-1);


//edit
const [editTitle,setEditTitle]=useState("");
const [editDescription,setEditDescription]=useState("");

const apiURL="https://todo-mini-server.onrender.com";


const handleSubmit = ()=>{
  setError("")
//check inputs
if (title.trim() !=="" && description.trim() !=="") {
    fetch(apiURL+"/todos",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({title,description})

    }).then((res)=>{
        if(res.ok){
         //add item to list 
        setTodos([...todos,{title,description}]);
        setTitle(""); // to clear input box after submit
        setDescription(""); //to clear input box after submit
        setMessage("Item Added successfully");
        setTimeout(()=>{
          setMessage("")
        },3000)

        }else{
            //set error
        setError("Unable to create todo item");
        }
      
    }).catch((error) => {
      setError("Unable to create todo item");
    })
  
}
}

useEffect(()=>{
  getItems()
},[])

const getItems = ()=>{
  fetch(apiURL+"/todos")
  .then((res)=>res.json())
  .then((res)=>{
    setTodos(res)
  })

}


const handleEdit=(item)=>{
  setEditId(item._id);
  setEditTitle(item.title);
  setEditDescription(item.description);
}


const handleUpdate=()=>{
  setError("")
//check inputs
if (editTitle.trim() !=="" && editDescription.trim() !=="") {
    fetch(apiURL+"/todos/"+editId,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({title:editTitle,description:editDescription})

    }).then((res)=>{
        if(res.ok){
         //update item to list 

        const updatedTodos= todos.map((item)=>{

          if(item._id==editId){
           item.title=editTitle;
           item.description=editDescription;
          }
          return item;

         })
        setTodos(updatedTodos);
        setEditTitle("");
        setEditDescription("");
        setMessage("Item updated successfully");
        setTimeout(()=>{
          setMessage("")
        },3000)

        setEditId(-1);
        }else{
            //set error
        setError("Unable to Update the todo item");
        }
      
    }).catch(() => {
      setError("Unable to update the todo item");
    })
  
}

}

const handleEditCancel=()=>{
  setEditId(-1)
}


const handleDelete=(id)=>{
  if (window.confirm("Are you sure want to delete ?")) {
    fetch(apiURL+"/todos/"+id,{
      method:"DELETE"
    })
    .then(()=>{
      const updatedTodos=todos.filter((item)=> item._id !== id)
      setTodos(updatedTodos);
    })
    
  }

}
  return <>
      <div className="row p-3 bg-success text-light mt-2">
        <h1>TODO APP</h1>
      </div>

      <div className="row">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}

        <div className="form-group d-flex gap-2">
          <input className="form-control" placeholder="Title" value={title} type="text" onChange={(e)=>setTitle(e.target.value)} />
          <input
            className="form-control"
            value={description}
            placeholder="Description"
            type="text"
            onChange={(e)=>setDescription(e.target.value)}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </div>

{/* //-----------tasks:------------------------------------ */}
      <div className="row mt-4">
       <h3>Tasks</h3>
       <div className="col-md-6">
       <ul className="list-group">
        {
         todos.map((item)=><li className="list-group-item  bg-warning d-flex justify-content-between align-items-center my-2">
         <div className="d-flex flex-column me-2">
{
  editId ==-1 || editId !==item._id?<>
    <span className="fw-bold">{item.title}</span>
    <span >{item.description}</span>
  </>:<>
  <div className="form-group d-flex gap-2">
          <input className="form-control" placeholder="Title" value={editTitle} type="text" onChange={(e)=>setEditTitle(e.target.value)} />
          <input
            className="form-control"
            value={editDescription}
            placeholder="Description"
            type="text"
            onChange={(e)=>setEditDescription(e.target.value)}
          />
        
        </div>
  </>
}
         </div>

         <div className="d-flex gap-2">

         {editId == -1 || editId !==item._id ? <button className="btn btn-info" onClick={()=>handleEdit(item)}>Edit</button>:<>
         <button onClick={handleUpdate}>Update</button>
         </>}

         {editId == -1 ?<button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button>:
         <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>}

         </div>
          </li> 
          ) 
        }
       
       </ul>
       </div>
       

   

      </div>
    </>
  
}

export default Todo;
