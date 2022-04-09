import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import Button from '@material-ui/core/Button';
import { TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import EditIcon from '@material-ui/icons/Edit';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';



const useStyles = makeStyles((theme) => ({
  root2: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  root1: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  input: {
    color: "black",
  },
  root: {
    width:'18%',
    "& .MuiFormLabel-root": {
      color: "#757575",
      zIndex:"-1",
    },
    "@media (max-width: 499px)":{
      width:'30%',
    },
    "@media (min-width:400px) and (max-width: 768px)": {
      width:'40%',
    },
    "@media (min-width:768px) and (max-width: 1200px)":{
      width:'30%'
    }
  },
  cssOutlinedInput: {
    "&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
      borderColor: "#9e9e9e" //default      
    },
    "&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
      borderColor: "#212121" //hovered
    },
    "&$cssFocused $notchedOutline": {
      borderColor:  "#bdbdbd" //focused
    }
  },
  notchedOutline: {},
  cssFocused: {},
  error: {},
  disabled: {}
}));





const Todo = () => {
  const classes = useStyles();
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasklist, setTaskList] = useState([]);
  const [flag, setFlag] = useState(0)
  var [data, setData] = useState(0)
  const [spacing, setSpacing] = React.useState(10);
  var objup;
  


  // Fetch the Tasks in database
  const gettask = () => {
  
    Axios.get("http://127.0.0.1:8000/")
      .then((response) => {
        setTaskList(response.data);
        
      })
      .catch((err) => console.log("error is ", err));
     
  };


  // conditional rendering (Button)
  const renderButton = () => {
    if(flag){
      return (
        <>
        <br/> 
        <Button 
        style={{marginRight:"20px"}} 
        type="button" 
        variant="contained" 
        color='primary' 
        onClick={updatingTask}
        > 
        Update Task
        </Button> 
        <Button 
        type="button" 
        variant="contained" 
        color="secondary"  
        onClick={cancelTask}> 
        Cancel 
        </Button>
       {/*  <input type="button" onClick={updatingTask}  value="updateTask"/>
        <input type="button" onClick={cancelTask} value="Cancel" /> */}
      </>
      )
    }
    else{
      return (
        <>
        <br />
      <Button
      variant="contained" color="primary"
      type="submit"
      
      /* style={{ marginTop: "10px", padding: "2px 7px", fontSize: "15px" }} */
    >Add Task</Button>
    </>
    )
    }
    
  }

 



//To Update the tasks, get the task from database-Display the task to be updated
const updateTask = (id)=>{
  console.log('update clicked'+id)
  window.myGlobalVar = id
  Axios.get(`http://127.0.0.1:8000/${id}`)
  .then(async(response)=> 
    {
    setTask(response.data[0].taskname)
    setDeadline(response.data[0].deadline)
    }
  ).catch(err=>console.log('error is ',err))
  setFlag(1)
}


//delete the task
const deleteTask =(id)=>{
  if(flag ===1){
    setTask('')
    setDeadline('')
    setFlag(0)
  }


  console.log(`Delete id is ${id}`)
  Axios.delete(`http://127.0.0.1:8000/delete/${id}`)
  .then((response)=>
  {
    alert('Selected Task deleted!')
    console.log(response.data)
    const updatedTasks = tasklist.filter((e)=>e._id !==id)
    setTaskList(updatedTasks)
    getting()
    if(data===0){
      setData(1)
     
    }
  })
}


//Cancel button to remove the updated text box content
const cancelTask = () =>{
  setTask("")
  setDeadline("")
  setFlag(0)
}




const getting = ()=>{
  
  Axios.get('http://localhost:8000/getting')
  .then((response)=>{
    console.log('Document number is',response.data)
    setData(response.data)
    
  })
}


 useEffect(() => {
    
    gettask();
    getting();
  
  },[]);








//Add the task from DataBase
let AddTask=()=>{
  Axios.post("http://127.0.0.1:8000/createtask", {
    task: task,
    deadline: deadline,
  }).then((response) => {
    console.log(response.data);
    alert("Your Tasks Added Successfully!!!");
    setTaskList([...tasklist, {_id:response.data._id,taskname: task, deadline: deadline }]);
    gettask();
    console.log('tasks',tasklist)
    setTask("");
    getting();
    
    setDeadline("");
    setData(1)
  });
}



//Update the task and get the task
const updatingTask =()=>{
  
  objup=window.myGlobalVar;
  console.log('update pls',objup);
  console.log('....',task);
  console.log('...',deadline);
  console.log('flag',flag)
  if (task === "" || deadline === "") {
    alert('taskname or deadline cannot be empty')
    return
  }
  Axios.put("http://127.0.0.1:8000/update",{taskname:task,deadline:deadline, id:objup})
  .then(()=>
  {
    setFlag(0)
    console.log('flag',flag)
  gettask()
  setTask('')
  setDeadline('')
 
  })

}

//To add the task + update the task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (task === "" || deadline === "") {
      alert("Taskname and Deadline cannot be empty");
      return;
    }
    console.log("Submitted!!");
    
    if(flag===1)
    {
      updatingTask()
      return
    }
    AddTask();
    
  };
  
  const result=()=>{
    if (data ===0)
    {
      return <Typography style={{margin:'30px'}}>No tasks to display</Typography>
    }
  }

  return (
    <>
      <center className='head'>
        <h2>Todo-App using MERN Stack</h2>
        
      </center>
      <div className='frm'>
      <center>
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="task" className="head1">Task Name</label> */}
          
        
          <TextField 
          label='Task Name'
          
          color="primary"
          placeholder='Enter your task name...'
          variant='outlined'
          sx={{ input: { color: 'red' } }}
          
          className={classes.root}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
            inputMode: "numeric"
          }}
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          />
       



         {/*  <input
            type="text"
            id="task"
            value={task}
            style={{ marginBottom: "15px", marginTop: "7.5px" }}
            placeholder="Enter the tasks here!!!"
            onChange={(e) => setTask(e.target.value)}
          />
 */}






          {/* <br />
          <label htmlFor="date"  className="head1">Deadline</label>
          <br />
          <input
            type="text"
            id="date"
            value={deadline}
            style={{ marginBottom: "15px", marginTop: "7.5px" }}
            placeholder="Enter the deadline for tasks!!!"
            onChange={(e) => setDeadline(e.target.value)}
          />{" "}
          <br />
           */}
&emsp;&emsp;
          <TextField 
          label='Deadline'
          color="primary"
          placeholder="Enter the deadline for tasks!!!"
          variant='outlined'
          className={classes.root}
          sx={{ input: { color: 'red' } }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            },
            inputMode: "numeric"
          }}
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          />
<br />
{renderButton()}

           
{/* width: {width} ~ height: {height} */}
        </form>
          {/* {flag ? <button onClick={cancelTask}>cancel</button>: null} */}

{result()}
           {/* {  data ?null: <h3>No tasks to display please enter tasks!!!</h3>}   */}

{/* {data ?<Typography variant="h6">List of task details with deadline</Typography>:null} */}
</center>
<div  style={{marginTop:'40px'}}>
  <center>
   <Typography style={{margin:'10px'}}>Total Tasks to complete: {data}</Typography>  </center>
<Grid container direction="column"
  alignItems="center"
  justifyContent="center" className={classes.root2} spacing={0}>
      <Grid item xs={2} sm={10} md={8}>
        <Grid container justifyContent="center" spacing={10}>
{tasklist.map((val, key) => {
          return (
            <Grid key={key} item >  
<Card key={key} className={classes.root1} >
      <CardActionArea>
        
        <CardContent>
          <Typography gutterBottom variant="h6" component="h6">
          
          </Typography>
          <Typography variant="body2" color="inherit" component="p">
           <strong>{key+1})</strong> <br/><div style={{marginLeft:'14px',marginTop:'5px'}}>
           <strong># </strong>  {val.taskname} <br />
           <strong>#</strong>  {val.deadline} (Deadline)</div>
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small"  onClick={()=>{updateTask(val._id)}} startIcon={<EditIcon/>} color="textSecondary">
          Edit
        </Button>
        <Button size="small" color="secondary"  onClick={()=>deleteTask(val._id)} startIcon={<CancelRoundedIcon/>}>
          delete
        </Button>
      </CardActions>
    </Card>
    </Grid>

);
        })}
 

 </Grid>
      </Grid>

</Grid>
</div>


       {/*  {tasklist.map((val, key) => {
          return (
            <Typography>
              
            <ul className="list" key={key}>
              
              <li> {key+1}.
                TaskName -{val.taskname} ,
                 DeadLine - {val.deadline}&nbsp;&nbsp; &emsp;&emsp;
                
                  
                  <Button 
                  onClick={()=>{updateTask(val._id)}}
                  variant="contained"
                 
                  > <EditIcon/>
                  </Button>
                
                &nbsp;&nbsp;
                
                <Button 
                  onClick={()=>deleteTask(val._id)}
                  
                  
                 variant="contained"
                  ><CancelRoundedIcon color="secondary"/></Button>
                 
                
              </li>
            </ul>
            </Typography>
          );
        })} */}
          </div>
    </>
  );
};

export default Todo;
