import React, { useContext, useState } from "react";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import { GlobalContext } from "../contexts/globalContext";
import Button from "react-bootstrap/Button";
import Moment from "moment";
import axios from "axios";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import Nav from "react-bootstrap/Nav";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GrowingKids() {
  const [addNoteMotal, setaddNoteMotalShow] = React.useState(false);

  const [state, dispatch] = useContext(GlobalContext);
  const [getFile, setgetFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [addWeightKidShow, setaddWeightKidShow] = useState(false);
  const [addNoteKidShow, setaddNoteKidShow] = useState(false);
  const [addProcessedKidShow, setaddProcessedKidShow] = useState(false);

  const formData = new FormData();
  const formData2 = new FormData();
  let WeightformData = new FormData();
  let NoteformData = new FormData();
  function setAddWeightsShow(val) {
    dispatch({
      type: "showAddWeightsModal",
      payload: val,
    });
  }
  const handleFileChange = (event) => {
    console.log(event.target.files);
    setSelectedFile(event.target.files[0]);
  };
  const handleDocumentUpload = async (event) => {
    event.preventDefault();
    formData2.append("file", selectedDocument);
    formData2.append("rabbit", state.SelectedRabbit.id);
    let newSelectedRabbit = {};
    const response = axios.post(
      "http://192.168.0.156:3000/database/uploadFile",
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

  const [inputs, setInputs] = useState({});
  let GrowingWeightformData = new FormData();
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
      "http://192.168.0.156:3000/database/newnote/rabbit",
      inputs,
      { "Content-Type": "multipart/form-data" }
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    setaddNoteMotalShow(false);
  };
  const [GrowingKidsInputs, setGrowingKidsInputs] = useState({});

  const handleGrowingKidsUpdate = (event) => {
    event.preventDefault();
    let newSelectedKid = {};
    //console.log(rabbitinputs);
    //  try {
    //   formData.append('file', selectedFile);
    //   newSelectedKid['Pic'] = selectedFile.name
    //  } catch (error) {

    //  }

    //formData.append('data',inputs);
    //inputs.append('file', selectedFile);

    Object.entries(state.SelectedGrowingKid).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
      newSelectedKid[key] = value;
    });

    Object.entries(GrowingKidsInputs).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
      formData.append(key, value);
      newSelectedKid[key] = value;
    });
    dispatch({
      type: "SelectedGrowingKid",
      payload: newSelectedKid,
    });
    console.log(formData);
    const response = axios.post(
      "http://192.168.0.156:3000/database/updateRabbitKids/" +
        state.SelectedLitter.id +
        "/" +
        state.SelectedGrowingKid.KidItemID,
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
      type: "reloadSelectedDrowingRabbit",
      payload: true,
    });
    setaddProcessedKidShow(false);
  };

  const handleGrowingKidChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    setGrowingKidsInputs((values) => ({ ...values, [name]: value }));

    console.log(state.SelectedGrowingKid);
  };

  const handleGrowingAddWeight = async (event) => {
    event.preventDefault();

const myForm = document.getElementById("growingWeightsForm");
const formElements = myForm.elements;
let sendData;
function delay(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));

}
async function loopWithPause() {
for (const element of formElements) {
  const column = document.getElementById(element.id);
  try {
     sendData = {
      Litter: column.name,
      Rabbit: column.id,
      Date: Moment().local(),
      Weight: column.value,
    };

    console.log(column.name);
    console.log(column.id);
    console.log(column.value);
  } catch (error) {}

  const response = axios.post(
    "http://192.168.0.156:3000/database/newweight",
    sendData
  );
  await delay(500);
  console.log(response);
}
}
 loopWithPause();   

    dispatch({
      type: "reloadSelectedDrowingRabbit",
      payload: true,
    });
    setaddWeightKidShow(false);
  };
  const handleKidAddWeight = (event) => {
    let WeightformData = new FormData();

    console.log(state.SelectedGrowingKid);
    event.preventDefault();
    WeightformData.append("Litter", state.SelectedGrowingKid.LitterIDDB);
    WeightformData.append("Rabbit", state.SelectedGrowingKid.KidItemID);
    const element = document.querySelector("#KidsNewWeight");
    const value = element.value;
    WeightformData.append("Weight", value);
    console.log(WeightformData);

    const response = axios.post(
      "http://192.168.0.156:3000/database/newweight",
      WeightformData
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    setaddWeightKidShow(false);
  };
  const handleaddGrowingWeightChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    console.log(name + ":" + value);

    GrowingWeightformData.append(name, value);
  };
  const handleaddWeightChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    console.log(name + ":" + value);
    //formData.append(name, value);
    //WeightformData.append("name", "45645");
  };
  const handleKidAddNote = (event) => {
    event.preventDefault();
    let NoteformData = new FormData();
    NoteformData.append("LitterID", state.SelectedGrowingKid.LitterIDDB);
    NoteformData.append("KidID", state.SelectedGrowingKid.KidItemID);
    const elementTitle = document.querySelector("#newKideNoteTitle");
    const Titlevalue = elementTitle.value;
    const elementNote = document.querySelector("#newKideNoteNote");
    const Notevalue = elementNote.value;

    NoteformData.append("Title", Titlevalue);
    NoteformData.append("Note", Notevalue);
    NoteformData.append("Date", Moment().format("MM/DD/YY"));

    const response = axios.post(
      "http://192.168.0.156:3000/database/newnote/Kid",
      NoteformData
    );
    console.log(response);
    dispatch({
      type: "reloadSelectedDrowingRabbit",
      payload: true,
    });
    setaddNoteKidShow(false);
  };
  const handleaddNoteChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    console.log(name + ":" + value);
    //formData.append(name, value);
    //WeightformData.append("name", "45645");
  };

  const CardImage = () => {
    return (
      <Card.Img
        variant="top"
        class="img-thumbnail"
        src={state.SelectedGrowingKid.Pic}
      />
    );
  };
  const options = {
    responsive: true,
    plugins: {
      BackgroundColor: {
        color: "rgba(255, 255, 255, 1)",
      },
      legend: false,
      title: {
        display: true,
        text: "Kids Weight",
      },
    },
  };
  const data = {
    labels: state.SelectedGrowingKidLables,
    datasets: [
      {
        label: "GRowing Scale",
        color: "rgba(255, 255, 255, 1)",
        data: state.SelectedGrowingKidWeights,
        borderColor: "rgba(252, 247, 247, 1)",
        backgroundColor: "rgba(246, 7, 7, 0.5)",
      },
    ],
  };
  return (
    <>
      <Container
        fluid
        className="litterContainer"
        style={{ "background-color": "grey", height: "800px" }}
      >
        <br />
        {state.GrowingKidSelected && (
          <Row>
            <Col sm={4}>
              <Accordion defaultActiveKey="0" data-bs-theme="dark">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>General Info</Accordion.Header>
                  <Accordion.Body data-bs-theme="dark">
                    <Form
                      onSubmit={handleGrowingKidsUpdate}
                      class="bg-secondary text-light"
                      data-bs-theme="dark"
                    >
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="kidid">
                          <Form.Label>Kid ID</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder={state.SelectedGrowingKid.KidID}
                            name="KidID"
                            onChange={handleGrowingKidChange}
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="Mother">
                          <Form.Label>Mother</Form.Label>
                          <Card.Text>{state.SelectedLitter.Mother}</Card.Text>
                        </Form.Group>
                        <Form.Group as={Col} controlId="Father">
                          <Form.Label>Father</Form.Label>
                          <Card.Text>{state.SelectedLitter.Father}</Card.Text>
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col} controlId="dateBorn">
                          <Form.Label>Born</Form.Label>
                          <Form.Text id="passwordHelpBlock"></Form.Text>
                          <Form.Control
                            type="date"
                            value={Moment(state.SelectedGrowingKid.Born).format(
                              "YYYY-MM-DD"
                            )}
                            name="Date_Born"
                            onChange={handleGrowingKidChange}
                          />
                        </Form.Group>
                        <Form.Group as={Col} controlId="SexCheckbox">
                          <Form.Label>Sex</Form.Label>
                          <Form.Select
                            aria-label="Sex"
                            name="Sex"
                            value={state.SelectedGrowingKid.Sex}
                            onChange={handleGrowingKidChange}
                          >
                            <option value="" key=""></option>
                            {SexType.map((sex) => (
                              <option value={sex} key={sex}>
                                {sex}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Row>
                      <Button size="sm" type="submit">
                        Update
                      </Button>
                    </Form>
                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setaddWeightKidShow(true);
                        }}
                      >
                        Add Weight
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setaddNoteKidShow(true);
                        }}
                      >
                        Add Note
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setaddProcessedKidShow(true);
                        }}
                      >
                        Processed
                      </Button>
                    </ButtonGroup>
                    <Line options={options} data={data} />
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1" variant="secondary">
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
            </Col>
            <Col sm={4}>
              <Container>
                <Card
                  data-bs-theme="dark"
                  className="text-center p-2"
                  style={{ border: "1px solid black" }}
                >
                  <Card.Title>Notes</Card.Title>
                  <Card.Body>
                    {[...state.SelectedGrowingKidNotes]
                      .reverse()
                      .map((note) => (
                        <Card
                          className="my-3 mx-2 p-1 text-center"
                          key={note.id}
                        >
                          <Card.Body>
                            <Card.Title>{note.Title}</Card.Title>

                            <Card.Text>{note.Note}</Card.Text>
                          </Card.Body>
                          <Card.Footer className="text-muted">
                            {Moment(note.Date).format("MM/DD/YY")}{" "}
                          </Card.Footer>
                        </Card>
                      ))}
                  </Card.Body>
                </Card>
              </Container>
            </Col>
            <Col sm={3}>
              <Container>
                <Card
                  data-bs-theme="dark"
                  className="text-center p-2"
                  style={{ border: "1px solid black" }}
                >
                  <Card.Title>Tasks</Card.Title>
                  {[...state.SelectedGrowingKidTasks].reverse().map((task) => (
                    <Card className="my-3 mx-2 p-1 text-center" key={task.id}>
                      <Card.Body>
                        <Card.Title>{task.Title}</Card.Title>
                        <Card.Text>{task.Note}</Card.Text>
                      </Card.Body>
                      <Card.Footer className="text-muted">
                        {Moment(task.Date).format("MM/DD/YY")}{" "}
                      </Card.Footer>
                    </Card>
                  ))}
                </Card>
              </Container>
            </Col>
          </Row>
        )}
      </Container>

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

            <Form.Group controlId="Rabbit">
              <Form.Label>Rabbit</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="Rabbit"
                value={state.SelectedRabbit.Name}
                onChange={handleChange}
                id={state.SelectedRabbit.id}
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
        show={addProcessedKidShow}
        onHide={() => setaddProcessedKidShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Processed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGrowingKidsUpdate}>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Final Weight"
                name="FinalWeight"
                id="FinalWeight"
                step="0.01"
                onChange={handleGrowingKidChange}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Dressed Weight"
                name="DressedWeight"
                id="DressedWeight"
                step="0.01"
                onChange={handleGrowingKidChange}
              />
            </InputGroup>
            <Form.Control
              type="date"
              placeholder="Date"
              name="DateProcessed"
              id="DateProcessed"
              onChange={handleGrowingKidChange}
            />

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal
        show={state.showAddWeightsModal}
        onHide={() => setAddWeightsShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Weights
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGrowingAddWeight} id="growingWeightsForm">
            {state.GrowingRabbits.map((kid) => (
              <Form.Group as={Col} class="col-sm-2 col-lg-2">
                <Form.Text htmlFor={kid.id}>Kid: {kid.KidID}</Form.Text>

                <Form.Control
                  type="number"
                  placeholder="Weight"
                  id={kid.KidItemID}
                  step="0.01"
                  name={kid.LitterIDDB}
                  onChange={handleaddGrowingWeightChange}
                />
              </Form.Group>
            ))}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        show={addWeightKidShow}
        onHide={() => setaddWeightKidShow(false)}
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
          <Form onSubmit={handleKidAddWeight}>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Weight"
                name="Weight"
                step="0.01"
                id="KidsNewWeight"
                onChange={handleaddWeightChange}
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
        show={addNoteKidShow}
        onHide={() => setaddNoteKidShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleKidAddNote}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Title"
                name="Title"
                id="newKideNoteTitle"
                onChange={handleaddNoteChange}
              />
              <InputGroup.Text id="basic-addon3">Title</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Control
                type="textarea"
                placeholder="Note"
                name="Note"
                id="newKideNoteNote"
                onChange={handleaddNoteChange}
              />
              <InputGroup.Text id="basic-addon3">Note</InputGroup.Text>
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
