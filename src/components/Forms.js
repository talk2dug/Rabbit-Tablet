  

  import React, {
      useContext,
      useEffect,
      useState,
      useCallback
  } from 'react';
  import Modal from 'react-bootstrap/Modal';
  import Form from 'react-bootstrap/Form';
  import {GlobalContext} from '../contexts/globalContext';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
  import axios from 'axios';
import Card from 'react-bootstrap/Card';

export function AddNoteButtonRabbit(){
    const [addNoteMotal, setaddNoteMotalShow] = React.useState(false);
    const [state, dispatch] = useContext(GlobalContext);
    const CardImage = () =>{
  return(<Card.Img variant="top" class='img-thumbnail' src={state.SelectedRabbit.Pic} />
  )

}
    return(
     
        <ButtonToolbar
                className="justify-content-between"
                aria-label="Toolbar with Button groups"
              >
                <CardImage/>
                  <ButtonGroup aria-label="Basic example" size="sm">
                    <DropdownButton as={ButtonGroup} title="Add" id="bg-nested-dropdown" style={{height: '40%'}}>
                <Dropdown.Item eventKey="1" onClick={() => {setaddNoteMotalShow(true)} }> Note</Dropdown.Item>
            <Dropdown.Item eventKey="2"> Task</Dropdown.Item>
            <Dropdown.Item eventKey="3"> Weight</Dropdown.Item>
              </DropdownButton>
        
            </ButtonGroup>
            
            </ButtonToolbar>
        
      
    )
}


  export default function NewNoteRabbit(){
    const [inputs, setInputs] = useState({});
     const [state, dispatch] = useContext(GlobalContext);
  const [addNoteMotal, setaddNoteMotalShow] = React.useState(false);
  const handleSubmit = async(event) => {
    event.preventDefault();

    const response =  await axios.post('http://192.168.196.4:3000/database/newnote/rabbit', inputs,{'Content-Type': 'multipart/form-data'});
    console.log(response)
  }
  const handleChange = (event) => {
    
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
    setInputs(values => ({...values, Rabbit: state.SelectedRabbit.Name}))
    setInputs(values => ({...values, id: state.SelectedRabbit.id}))
    
  }
 
return (
<Modal
      show={addNoteMotal}
      onHide={() => setaddNoteMotalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
  
        </Modal.Header>
        <Modal.Body>
          <h4>New Note</h4>
      
          <Form onSubmit={handleSubmit}>
         
              <Form.Group  controlId="Name">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Name" name="Title"  onChange={handleChange}/>
  
            </Form.Group>
            <Form.Group controlId="Note">
              <Form.Label>Note</Form.Label>
              <Form.Control as="textarea" rows={5}  name="Note" onChange={handleChange}/>
  
            </Form.Group>
        
        <Form.Group   controlId="Rabbit">
          <Form.Label>Rabbit</Form.Label>
          <Form.Control type="text" placeholder="Name" name="Rabbit" value={state.SelectedRabbit.Name} onChange={handleChange} id={state.SelectedRabbit.id}/>
          </Form.Group>
          
         
          <Button variant="primary" type="submit">
            Submit
          </Button> 
  
        </Form>
          
        </Modal.Body>
        <Modal.Footer>
             
          </Modal.Footer>
      </Modal>
)
}