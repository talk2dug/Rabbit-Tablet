import React, { useContext, useEffect, useState, useCallback } from "react";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import { GlobalContext } from "../contexts/globalContext";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Moment from "moment";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import InputGroup from "react-bootstrap/InputGroup";
export default function Rabbits() {
  const [addNoteMotal, setaddNoteMotalShow] = React.useState(false);
  const [addTaskMotal, setaddTaskMotal] = React.useState(false);

  const [state, dispatch] = useContext(GlobalContext);
  const [getFile, setgetFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  function setNewRabbitShow(val) {
    dispatch({
      type: "showNewRabbitModal",
      payload: val,
    });
  }
  const formData = new FormData();
  const formData2 = new FormData();
  const handleFileChange = (event) => {
    console.log(event.target.files);
    setSelectedFile(event.target.files[0]);
  };

  const handleRabbitSubmit = (event) => {
    event.preventDefault();

    console.log(rabbitinputs);
    const response = axios.post(
      "http://192.168.196.4:3000/database/newrabbit",
      rabbitinputs
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
  };
  const handleDocumentUpload = async (event) => {
    event.preventDefault();
    formData2.append("file", selectedDocument);
    formData2.append("rabbit", state.SelectedRabbit.id);
    let newSelectedRabbit = {};
    const response = axios.post(
      "http://192.168.196.4:3000/database/uploadFile",
      formData2,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          // Optional: Handle upload progress (e.g., update a progress bar)
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );
    console.log(response);
    dispatch({
      type: "SelectedRabbit",
      payload: newSelectedRabbit,
    });
  };

  const handleNewDocumentChange = (event) => {
    console.log(event.target.files);
    setSelectedDocument(event.target.files[0]);
    console.log(selectedDocument);
  };
  let SexType = ["NotAssigned", "Buck", "Doe"];
  let Cages = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const [inputs, setInputs] = useState({});
  const [RabbitTaskInputs, setRabbitTaskInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    setInputs((values) => ({ ...values, Rabbit: state.SelectedRabbit.Name }));
    setInputs((values) => ({ ...values, id: state.SelectedRabbit.id }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post(
      "http://192.168.196.4:3000/database/newnote/rabbit",
      inputs,
      { "Content-Type": "multipart/form-data" }
    );
    console.log(response);
  };
  const [rabbitinputs, setRabbitInputs] = useState({});
  const [MateInputs, setMateInputs] = useState({});

  const [addWeightShow, setaddWeightShow] = useState(false);
  const [MateShow, setMateShow] = useState(false);
  const showLitterNewModal = () => {
    dispatch({
      type: "showLitterNewModal",
      payload: true,
    });
  };
  const handleTaskSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post(
      "http://192.168.196.4:3000/database/newtask",
      RabbitTaskInputs,
      {
        "Content-Type": "multipart/form-data",
      }
    );
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    console.log(response);
  };

  const handleAddMate = (event) => {
    event.preventDefault();

    const elementBuck = document.querySelector("#MateBuck");
    const buckvalue = elementBuck.value;
    const elementDate = document.querySelector("#MateDate");
    const datevalue = elementDate.value;
    const elementNote = document.querySelector("#MateNote");
    const notevalue = elementNote.value;
    let dataToSend = {
      Buck: buckvalue,
      Date: Moment(datevalue).local(),
      Doe: state.SelectedRabbit.Name,
      Note: notevalue,
    };
    const response = axios.post(
      "http://192.168.196.4:3000/database/updateRabbitMate",
      dataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    setMateShow(false);
  };
  const handleAddWeight = (event) => {
    event.preventDefault();

    const element = document.querySelector("#RabbitNewWeight");
    const value = element.value;

    let dataToSend = {
      id: state.SelectedRabbit.id,
      Weight: parseFloat(value),
    };
    const response = axios.post(
      "http://192.168.196.4:3000/database/addRabbitWeight",
      dataToSend,
      {
        headers: {
          "Content-Type": "application/json",
        },
        onUploadProgress: (progressEvent) => {
          // Optional: Handle upload progress (e.g., update a progress bar)
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    setaddWeightShow(false);
  };
  const handleRabbitUpdate = (event) => {
    event.preventDefault();
    let newSelectedRabbit = {};
    //console.log(rabbitinputs);
    try {
      formData.append("file", selectedFile);
      newSelectedRabbit["Pic"] = selectedFile.name;
    } catch (error) {}

    //formData.append('data',inputs);
    //inputs.append('file', selectedFile);

    Object.entries(state.SelectedRabbit).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
      newSelectedRabbit[key] = value;
    });
    rabbitinputs.id = state.SelectedRabbit.id;

    Object.entries(rabbitinputs).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
      formData.append(key, value);
      newSelectedRabbit[key] = value;
    });
    dispatch({
      type: "SelectedRabbit",
      payload: newSelectedRabbit,
    });

    const response = axios.post(
      "http://192.168.196.4:3000/database/updateRabbit",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          // Optional: Handle upload progress (e.g., update a progress bar)
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    dispatch({
      type: "showNewRabbitModal",
      payload: false,
    });
  };

  const handleSeletLitterClick = (LitterID) => {
    let itemsToSearch = state.Litters;
    const foundItem = itemsToSearch.find((item) => item.LitterID === LitterID);

    dispatch({
      type: "SelectedLitterKids",
      payload: foundItem.Kids,
    });

    console.log(foundItem.Kids);
  };

  const handleMateChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setMateInputs((values) => ({ ...values, [name]: value }));

    console.log(state.SelectedRabbit);
  };
  const handleRabbitChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setRabbitInputs((values) => ({ ...values, [name]: value }));

    console.log(state.SelectedRabbit);
  };
  const handleTaskChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    let value = event.target.value;
    if (name === "Due") {
      value = Moment(value).local();
    }
    setRabbitTaskInputs((values) => ({ ...values, [name]: value }));
    setRabbitTaskInputs((values) => ({
      ...values,
      ["Rabbit"]: state.SelectedRabbit.Name,
    }));
    console.log(state.SelectedRabbit);
  };
  const reloadClickedCard = useCallback(async () => {
    let TasksToSearch = state.Tasks;
    const foundTaskItem = TasksToSearch.filter(
      (itemTask) => itemTask.Rabbit === state.SelectedRabbit.Name
    );
    let itemsToSearch = state.Rabbits;
    const foundItem = itemsToSearch.find(
      (item) => item.Name === state.SelectedRabbit.Name
    );
    console.log(foundItem);
    console.log(foundTaskItem);
    try {
      dispatch({
        type: "SelectedRabbit",
        payload: foundItem,
      });
      dispatch({
        type: "SelectedRabbitNotes",
        payload: foundItem.Notes,
      });
      dispatch({
        type: "SelectedRabbitTasks",
        payload: foundTaskItem,
      });
      dispatch({
        type: "showRabbitInfo",
        payload: true,
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, state.SelectedRabbit, state.Rabbits]);

  useEffect(() => {
    if (state.reloadRabbits) {
      reloadClickedCard();
      // This code will only run when 'shouldRunEffect' is true
      console.log("Effect is running because shouldRunEffect is true!");
      // Perform side effect here, e.g., data fetching, DOM manipulation
    }
  }, [state.reloadRabbits, reloadClickedCard]);

  const CardImage = () => {
    return (
      <Card.Img
        variant="top"
        class="img-thumbnail"
        src={state.SelectedRabbit.Pic}
      />
    );
  };

  return (
    <>
    <br/>
      <Container
        fluid
        className="litterContainer "
        style={{ "background-color": "grey", height: "85hv" }}
      >
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={7}>
            {state.showRabbitInfo && (
              <Accordion defaultActiveKey="0" data-bs-theme="dark">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>General Info </Accordion.Header>
                  <Accordion.Body data-bs-theme="dark">
                    <br />
                    <ButtonToolbar
                      className="justify-content-between"
                      aria-label="Toolbar with Button groups"
                    >
                      <CardImage />
                      <ButtonGroup aria-label="Basic example" size="sm">
                        <DropdownButton
                          as={ButtonGroup}
                          title="Add"
                          id="bg-nested-dropdown"
                          style={{ height: "30px" }}
                        >
                          <Dropdown.Item
                            eventKey="1"
                            onClick={() => {
                              setaddNoteMotalShow(true);
                            }}
                          >
                            {" "}
                            Note
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="2"
                            onClick={() => {
                              setaddTaskMotal(true);
                            }}
                          >
                            {" "}
                            Task
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={() => {
                              setaddWeightShow(true);
                            }}
                          >
                            {" "}
                            Weight
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={() => {
                              setMateShow(true);
                            }}
                          >
                            {" "}
                            Mate
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="3"
                            onClick={() => {
                              showLitterNewModal(true);
                            }}
                          >
                            {" "}
                            Kindling
                          </Dropdown.Item>
                        </DropdownButton>
                      </ButtonGroup>
                    </ButtonToolbar>

                    <Form
                      onSubmit={handleRabbitUpdate}
                      class="bg-secondary text-light"
                      data-bs-theme="dark"
                    >
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="Breed">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={state.SelectedRabbit.Name}
                            name="Name"
                            onChange={handleRabbitChange}
                          />
                        </Form.Group>
                        <Form.Group as={Col} controlId="Breed">
                          <Form.Label>Breed</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={state.SelectedRabbit.Breed}
                            name="Breed"
                            onChange={handleRabbitChange}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="Mother">
                          <Form.Label>Mother</Form.Label>
                          <Form.Select
                            aria-label="Mother"
                            name="Mother"
                            value={state.SelectedRabbit.Mother}
                            onChange={handleRabbitChange}
                          >
                            <option value="" key=""></option>
                            {state.Does.map((doe) => (
                              <option value={doe} key={doe}>
                                {doe}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} controlId="Father">
                          <Form.Label>Father</Form.Label>
                          <Form.Select
                            aria-label="Father"
                            name="Father"
                            value={state.SelectedRabbit.Father}
                            onChange={handleRabbitChange}
                          >
                            <option value="" key=""></option>
                            {state.Bucks.map((buck) => (
                              <option value={buck} key={buck}>
                                {buck}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="dateBorn">
                          <Form.Label>Date Born =</Form.Label>
                          <Form.Text id="passwordHelpBlock"></Form.Text>
                          <Form.Control
                            type="date"
                            value={Moment(
                              state.SelectedRabbit.Date_Born
                            ).format("YYYY-MM-DD")}
                            name="Date_Born"
                            onChange={handleRabbitChange}
                          />
                        </Form.Group>
                        <Form.Group as={Col} controlId="SexCheckbox">
                          <Form.Label>Sex</Form.Label>
                          <Form.Select
                            aria-label="Sex"
                            name="Sex"
                            value={state.SelectedRabbit.Sex}
                            onChange={handleRabbitChange}
                          >
                            <option value="" key=""></option>
                            {SexType.map((sex) => (
                              <option value={sex} key={sex}>
                                {sex}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>

                        <Form.Group as={Col} controlId="Cage">
                          <Form.Label>Cage</Form.Label>

                          <Form.Select
                            aria-label="Cage"
                            name="Cage"
                            value={state.SelectedRabbit.Cage}
                            onChange={handleRabbitChange}
                          >
                            <option value="" key=""></option>
                            {Cages.map((cage) => (
                              <option value={cage} key={cage}>
                                {cage}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="LatestWeight">
                          <Form.Label>Latest Weight: </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={state.SelectedRabbitCurrentWeight}
                            readOnly
                          />
                        </Form.Group>
                        <Form.Group as={Col} controlId="Breeder">
                          <Form.Label>Breeder</Form.Label>
                          <Form.Select
                            aria-label="Breeder"
                            name="Breeder"
                            value={state.SelectedRabbit.Breeder}
                            onChange={handleRabbitChange}
                          >
                            <option></option>
                            {state.BreedersSelect.map((breeder) => (
                              <option value={breeder} key={breeder}>
                                {breeder}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group controlId="formFile" className="mb-3">
                          <Form.Label>Select a file</Form.Label>
                          <Form.Control
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Form.Group>
                      </Row>
                      <Button type="submit">Update</Button>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1" variant="secondary ">
                  <Accordion.Header>Tasks</Accordion.Header>
                  <Accordion.Body
                    variant="bg-secondary "
                    key="whatever"
                    data-bs-theme="dark"
                    style={{
                      height: "65vh",
                      overflowY: "scroll",
                    }}
                  >
                    <Row className="justify-content-center">
                      <Col xs={12} md={6} lg={8}>
                        {state.SelectedRabbitTasks.map((taskItem, i) => (
                          <Card
                            key={i}
                            style={{}}
                            className="my-3 mx-2 p-1 text-center"
                          >
                            <Card.Body>
                              <Card.Title>{taskItem.Title}</Card.Title>

                              <Card.Text>{taskItem.Note}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-muted">
                              Due: {Moment(taskItem.Due).fromNow()}{" "}
                            </Card.Footer>
                          </Card>
                        ))}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" variant="secondary">
                  <Accordion.Header>Litters</Accordion.Header>
                  <Accordion.Body class="bg-secondary">
                    <Tab.Container
                      id="list-group-tabs-example"
                      defaultActiveKey="#link1"
                    >
                      <Row className="justify-content-center">
                        <Col xs={12} md={6} lg={4}>
                          <ListGroup>
                            {state.SelectedRabbitsLitters.map((Litter) => (
                              <ListGroup.Item
                                action
                                onClick={() => {
                                  handleSeletLitterClick(Litter.LitterID);
                                }}
                              >
                                {Litter.LitterID}
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Col>
                      </Row>
                      <Col xs={12} md={6} lg={8}>
                        <Table striped bordered hover class="table-fixed">
                          <thead>
                            <tr>
                              <th>KidID</th>
                              <th>Status</th>
                              <th>Sex</th>
                              <th>Birth Weight</th>
                              <th>Final Weight</th>
                              <th>Dressed Weight</th>
                            </tr>
                          </thead>
                          <tbody>
                            {state.SelectedLitterKids.map((Kids) => (
                              <tr>
                                <td>{Kids.KidID}</td>
                                <td>{Kids.Status}</td>
                                <td>{Kids.Sex}</td>
                                <td>{Kids.BirthWeight}</td>
                                <td>{Kids.FinalWeight}</td>
                                <td>{Kids.DressedWeight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Tab.Container>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3" variant="secondary">
                  <Accordion.Header>Files</Accordion.Header>
                  <Accordion.Body class="bg-secondary">
                    <Form
                      onSubmit={handleDocumentUpload}
                      class="bg-secondary text-light"
                      data-bs-theme="dark"
                    >
                      <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Select a file</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={handleNewDocumentChange}
                        />
                        <Button type="submit">Upload</Button>
                      </Form.Group>
                    </Form>
                    <Nav.Link href={getFile} download>
                      Home (Standard)
                    </Nav.Link>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}
          </Col>
          <Col
            style={{ "background-color": "grey" }}
            data-bs-theme="dark"
            
          >
            <Container
              fluid
              className="litterContainer"
              style={{ overflow: "hidden", height: "300px" }}
            >
              <Row className="justify-content-center">
                <Col xs={12} md={8} lg={8}>
                  <Card variant="dark" className="text-center">
                    <Card.Title>Notes</Card.Title>
                    <Container
                      fluid
                      className="litterContainer"
                      style={{ overflow: "auto", height: "100hv" }}
                    >
                      {[...state.SelectedRabbitNotes].reverse().map((note) => (
                        <Card
                          variant="dark"
                          className="my-3 mx-2 p-1 text-center"
                          key={note.id}
                        >
                          <Card.Body>
                            <Card.Title>{note.Title}</Card.Title>

                            <Card.Text>{note.Note}</Card.Text>
                          </Card.Body>
                          <Card.Footer className="text-muted">
                            {Moment(note.Date).format("MM/DD/YY")} @{" "}
                            {Moment(note.Date).format("hh:mm a")}
                          </Card.Footer>
                        </Card>
                      ))}
                    </Container>
                  </Card>
                </Col>
              </Row>
            </Container>

            <Container
              fluid
              className="litterContainer"
              style={{ overflow: "auto", height: "200px" }}
            >
              {state.showBreeders && (
                <Table striped size="sm" responsive>
                  <tbody>
                    <tr>
                      <td>Address</td>
                      <td colSpan={2}>
                        <p class="card-text text-muted">
                          {state.selectedBreeder.Address}
                        </p>
                        <p class="card-text text-muted">
                          {state.selectedBreeder.City},{" "}
                          {state.selectedBreeder.State}{" "}
                          {state.selectedBreeder.Zip}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td colSpan={2}>{state.selectedBreeder.Email}</td>
                    </tr>
                    <tr>
                      <td>Phone</td>
                      <td colSpan={2}>{state.selectedBreeder.Phone}</td>
                    </tr>
                    <tr>
                      <td>Farm</td>
                      <td colSpan={2}>{state.selectedBreeder.Farm}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Container>
          </Col>
        </Row>
      </Container>
      <Modal
        show={state.showNewRabbitModal}
        onHide={() => setNewRabbitShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>New Rabbit</h4>

          <Form onSubmit={handleRabbitSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Breed">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="Name"
                  onChange={handleRabbitChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Breed">
                <Form.Label>Breed</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Rabbits Breed"
                  name="Breed"
                  onChange={handleRabbitChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Breeder">
                <Form.Label>Breeder</Form.Label>
                <Form.Select
                  aria-label="Breeder"
                  name="Breeder"
                  onChange={handleRabbitChange}
                >
                  <option>CHOOSE</option>
                  {state.BreedersSelect.map((breeder) => (
                    <option value={breeder} key={breeder}>
                      {breeder}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="Mother"
                onChange={handleRabbitChange}
              >
                <Form.Label>Mother</Form.Label>
                <Form.Select aria-label="Mother" name="Mother">
                  <option>Choose</option>
                  {state.Does.map((doe) => (
                    <option value={doe} key={doe}>
                      {doe}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="Father"
                onChange={handleRabbitChange}
              >
                <Form.Label>Father</Form.Label>
                <Form.Select aria-label="Father" name="Father">
                  <option>Choose</option>
                  {state.Bucks.map((buck) => (
                    <option value={buck} key={buck}>
                      {buck}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="dateBorn"
                onChange={handleRabbitChange}
              >
                <Form.Label>Date Born</Form.Label>
                <Form.Control type="date" placeholder="Date" name="Date_Born" />
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="SexCheckbox"
                onChange={handleRabbitChange}
              >
                <Form.Label>Sex</Form.Label>
                <Form.Select aria-label="Sex" name="Sex">
                  <option>Choose</option>
                  <option value="Not Sexed">Not Sexed</option>
                  <option value="Buck">Buck</option>
                  <option value="Doe">Doe</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        show={addNoteMotal}
        onHide={() => setaddNoteMotalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>New Note</h4>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="Name">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="Title"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="Note">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="Note"
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        show={addTaskMotal}
        onHide={() => setaddTaskMotal(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>New Task</h4>

          <Form onSubmit={handleTaskSubmit}>
            <Form.Group controlId="Name">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="Title"
                onChange={handleTaskChange}
              />
            </Form.Group>

            <Form.Group controlId="Note">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="textarea"
                rows={5}
                name="Note"
                onChange={handleTaskChange}
              />
            </Form.Group>
            <Form.Group controlId="Due">
              <Form.Label>Due</Form.Label>
              <Form.Control
                controlId="Due"
                type="date"
                placeholder="Due"
                name="Due"
                onChange={handleTaskChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal
        show={addWeightShow}
        onHide={() => setaddWeightShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Weight
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddWeight}>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Weight"
                name="Weight"
                id="RabbitNewWeight"
                step="0.01"
              />
              <InputGroup.Text id="basic-addon3">Pounds</InputGroup.Text>
            </InputGroup>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal
        show={MateShow}
        onHide={() => setMateShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Mate Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMate}>
            <InputGroup className="mb-3">
              <Form.Select
                aria-label="Buck"
                name="MateBuck"
                id="MateBuck"
                onChange={handleMateChange}
              >
                <option value="" key=""></option>
                {state.Bucks.map((buck) => (
                  <option value={buck} key={buck}>
                    {buck}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Date"
                name="Date"
                id="MateDate"
                onChange={handleMateChange}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Note"
                name="Notete"
                id="MateNote"
                onChange={handleMateChange}
              />
            </InputGroup>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
