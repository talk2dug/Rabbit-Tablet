import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import React, { useContext, useEffect, useState } from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
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
import Moment from "moment";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import { GlobalContext } from "../contexts/globalContext";
import ListGroup from "react-bootstrap/ListGroup";
import { Line } from "react-chartjs-2";
import axios from "axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

let labels = [];
let labels2 = [];
let weightData = [];
let selectedKidNotes = [];
let Does = [];
let Bucks = [];
let kidNumber = 0;
let WeightformData = new FormData();
let NoteformData = new FormData();
let Cages = [
  "Growing1",
  "Growing2",
  "Growing3",
  "Growing4",
  "Growing5",
  "Growing6",
];

export default function Litters() {
  const [state, dispatch] = useContext(GlobalContext);
  Does = state.Does;
  Bucks = state.Bucks;
  let kidForms = [];
  let SexType = ["NotAssigned", "Buck", "Doe"];
  const [addProcessedKidShow, setaddProcessedKidShow] = useState(false);

  const [addWeightKidShow, setaddWeightKidShow] = useState(false);
  const [addBirthWeightKidShow, setaddBirthWeightKidShow] = useState(false);
  const [addKidShow, setaddKidShow] = useState(false);
  const [editKidShow, seteditKidShow] = useState(false);
  const [addNoteKidShow, setaddNoteKidShow] = useState(false);
  const [litterinputs, setLitterInputs] = useState();
  const [KidWeightInputs, setKidWeightInputs] = useState();
  const [kidsinputs, setKidsInputs] = useState([]);
  const [GrowingKidsInputs, setGrowingKidsInputs] = useState({});
  const [items, setItems] = useState([]);
  const formData = new FormData();
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
      type: "reloadRabbits",
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


  function setNewLitterShow(val) {
    dispatch({
      type: "showLitterNewModal",
      payload: val,
    });
  }

  function setEditLitterShow(val) {
    dispatch({
      type: "showLitterEditModal",
      payload: val,
    });
  }

  const handleEditKidChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    let value = event.target.value;

    setKidsInputs((values) => ({ ...values, [name]: value }));
  };
  const handleLitterChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    let value = event.target.value;
    if (name === "Bred" || name === "Born") {
      let originalDate = Moment(value);
      value = originalDate.local();
    }
    setLitterInputs((values) => ({ ...values, [name]: value }));
  };
  const handleaddWeightChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    let value = event.target.value;
    if (name === "Weight") {
      value = parseFloat(value);
    }
    let type = typeof value;
    console.log(type);
    //formData.append(name, value);
    //WeightformData.append("name", "45645");
  };
  const handleaddNoteChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    console.log(name + ":" + value);
    //formData.append(name, value);
    //WeightformData.append("name", "45645");
  };
  const handleKidAddNote = (event) => {
    event.preventDefault();
    NoteformData.append("LitterID", state.SelectedLitter.id);
    NoteformData.append("KidID", state.SelectedKid.id);
    const elementTitle = document.querySelector("#newKideNoteTitle");
    const Titlevalue = elementTitle.value;
    const elementNote = document.querySelector("#newKideNoteNote");
    const Notevalue = elementNote.value;

    let value = Moment().local();
    NoteformData.append("Title", Titlevalue);
    NoteformData.append("Note", Notevalue);
    NoteformData.append("Date", value);

    const response = axios.post(
      "http://192.168.0.156:3000/database/newnote/Kid",
      NoteformData
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    setaddNoteKidShow(false);
  };
  const changeKidToGRowing = () => {
    const response = axios.post(
      "http://192.168.0.156:3000/database/updateRabbitKids/" +
        state.SelectedLitter.id +
        "/" +
        state.SelectedKid.id,
      { Growing: true, Status: "Growing" }
    );
  };
  const handleKidAddBirthWeight = (event) => {
    event.preventDefault();
    WeightformData.append("Litter", state.SelectedLitter.id);
    WeightformData.append("Rabbit", state.SelectedKid.id);
    const element = document.querySelector("#KidsNewBirthWeight");
    const value = element.value;
    WeightformData.append("BirthWeight", parseFloat(value));
    console.log(WeightformData);
    let dataToSend = {
      Litter: state.SelectedLitter.id,
      Rabbit: state.SelectedKid.id,
      BirthWeight: parseFloat(value),
    };
    const response = axios.post(
      "http://192.168.0.156:3000/database/newbirthweight",
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
    setaddBirthWeightKidShow(false);
  };

  const handleKidAddWeight = (event) => {
    event.preventDefault();
    WeightformData.append("Litter", state.SelectedLitter.id);
    WeightformData.append("Rabbit", state.SelectedKid.id);
    const element = document.querySelector("#KidsNewWeight");
    const value = element.value;
    WeightformData.append("Weight", parseFloat(value));
    console.log(WeightformData);
    let date = Moment().local();
    let valueDate = date.format("MM/DD/YYYY");
    let dataToSend = {
      Litter: state.SelectedLitter.id,
      Rabbit: state.SelectedKid.id,
      Weight: parseFloat(value),
      Date: valueDate,
    };

    const response = axios.post(
      "http://192.168.0.156:3000/database/newweight",
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
    setaddWeightKidShow(false);
  };

  const handleLitterSubmit = (event) => {
    event.preventDefault();
    let addedKidds = [];
    function createFormItem(item) {
      litterinputs.Father = state.SelectedRabbitLatestMate.Buck;
      litterinputs.Mother = state.SelectedRabbit.Name;
      litterinputs.Bred = Moment(state.SelectedRabbitLatestMate.Date).format(
        "MM/DD/YYYY"
      );
      let newLitterFormData = { litterinputs, Kids: addedKidds };
      console.log(newLitterFormData);
      const response = axios.post(
        "http://192.168.0.156:3000/database/newlitter",
        newLitterFormData
      );
      console.log(response);
    }

    items.map((item, index) => {
      let kidIDInput = document.getElementById(item.KidID);
      let kidIDInputValue = kidIDInput.value;
      let SexIDInput = document.getElementById(item.Sex);
      let SexIDInputValue = SexIDInput.value;
      addedKidds.push({ KidID: kidIDInputValue, Sex: SexIDInputValue });
    });
    createFormItem();
  };

  const handleKidEdit = (event) => {
    event.preventDefault();

    let newKidFormData = { kidsinputs };
    newKidFormData["id"] = state.SelectedLitter.id;
    newKidFormData["Sex"] = kidsinputs.Sex;
    console.log(newKidFormData);
    const response = axios.post(
      "http://192.168.0.156:3000/database/updateRabbitKids/" +
        state.SelectedLitter.id +
        "/" +
        state.SelectedKid.id,
      newKidFormData
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    seteditKidShow(false);
  };
  const handleLitterEdit = (event) => {
    event.preventDefault();

    let newLitterFormData = { litterinputs };
    newLitterFormData["id"] = state.SelectedLitter.id;
    console.log(newLitterFormData);
    const response = axios.post(
      "http://192.168.0.156:3000/database/editlitter",
      newLitterFormData
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    setEditLitterShow(false);
  };

  const handleKidAdd = (event) => {
    event.preventDefault();

    let kidIDInput = document.getElementById("newKidID");
    let kidIDInputValue = kidIDInput.value;
    let SexIDInput = document.getElementById("newKidSex");
    let SexIDInputValue = SexIDInput.value;

    console.log(kidIDInputValue);
    console.log(SexIDInputValue);
    let newKidFormData = {
      KidID: kidIDInputValue,
      Sex: SexIDInputValue,
      LitterID: state.SelectedLitter.id,
    };
    const response = axios.post(
      "http://192.168.0.156:3000/database/addKidToLitter",
      newKidFormData
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });

    setaddWeightKidShow(false);
  };
  const getLitters = (nameToFind) => {
    let itemsToSearch = state.Litters;
    const foundItem = itemsToSearch.find(
      (item) => item.LitterID === nameToFind
    );
    return foundItem; // Returns the first matching object or undefined
  };
  const getKidItemByName = (nameToFind) => {
    let itemsToSearch = state.SelectedLitterKids;
    const foundItem = itemsToSearch.find((item) => item.KidID === nameToFind);
    return foundItem; // Returns the first matching object or undefined
  };
  const handleKidCardClick = (kidID) => {
    let kidInfo = getKidItemByName(kidID);
    console.log(kidInfo);
    dispatch({
      type: "SelectedKid",
      payload: kidInfo,
    });
    selectedKidNotes = kidInfo.Notes.reverse();
    let kidWeights = kidInfo.CurrentWeight;
    labels.length = 0;
    weightData.length = 0;
    kidWeights.map((weight) => {
      let date = Moment(weight.Date).format("MM/DD/YYYY");
      labels.push(date);
      weightData.push(weight.Weight);
      return date;
    });
  };
  const getLitterWeightAverages = () => {
    let litter = state.SelectedLitter.Kids;
    let arrayofWeights = [];
    let arrayofWeightsTemp = [];
    labels2.length = 0;
    console.log(litter);
    let currentKid = litter[0].CurrentWeight;
    console.log(currentKid.length);
    currentKid.map((data, index) => {
      labels2.push(index);
    });
    currentKid.map((weight, index) => {
      arrayofWeights.push(0);
    });
    litter.map((kid) => {
      let weights = kid.CurrentWeight;
      console.log(arrayofWeights);
      weights.map((weight, index) => {
        let addedWeight = arrayofWeights[index];
        let currentWeight = parseFloat(weight.Weight);
        console.log(currentWeight);
        let totaledWeight = addedWeight + currentWeight;
        arrayofWeights[index] = totaledWeight;
      });
    });
    arrayofWeights.map((weight, index) => {
      arrayofWeights[index] = arrayofWeights[index] / litter.length;
    });
    console.log(arrayofWeights);
    return arrayofWeights;
  };

  const handleLitterCardClick = (litter) => {
    console.log("Card clicked!" + litter);
    const litterItem = getLitters(litter);
    console.log(litterItem);

    dispatch({
      type: "SelectedLitter",
      payload: litterItem,
    });
    dispatch({
      type: "SelectedLitterKids",
      payload: litterItem.Kids,
    });

    // Perform desired actions here, e.g., navigate to a new page, open a modal
  };
  let addKidForm = () => {
    kidNumber = kidNumber + 1;

    kidForms = { KidID: `Kid${kidNumber}`, Sex: `Sex${kidNumber}` };
    setItems([...items, kidForms]);
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
    labels: labels,
    datasets: [
      {
        label: "GRowing Scale",
        color: "rgba(255, 255, 255, 1)",
        data: weightData,
        borderColor: "rgba(252, 247, 247, 1)",
        backgroundColor: "rgba(246, 7, 7, 0.5)",
      },
    ],
  };
  const options2 = {
    responsive: true,
    plugins: {
      BackgroundColor: {
        color: "rgba(255, 255, 255, 1)",
      },
      legend: false,
      title: {
        display: true,
        text: "Litter AVG Weight",
      },
    },
  };
  const data2 = {
    labels: labels2,
    datasets: [
      {
        label: "GRowing Scale",
        color: "rgba(255, 255, 255, 1)",
        data: getLitterWeightAverages(),
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
        <Row>
          <Col>
            <Card data-bs-theme="dark" style={{ width: "40rem" }}>
              <Row>
                <Col>
                  <Card data-bs-theme="dark" style={{ width: "18rem" }}>
                    <Card.Header>General Info</Card.Header>
                    <Card.Body>
                      <Card.Title>
                        ID: {state.SelectedLitter.LitterID}
                      </Card.Title>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          Bred:{" "}
                          {Moment(state.SelectedLitter.Bred).format("MM/DD/YY")}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Born:{" "}
                          {Moment(state.SelectedLitter.Born).format("MM/DD/YY")}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Moved Grow:{" "}
                          {Moment(state.SelectedLitter.MovedToGrow).format(
                            "MM/DD/YY"
                          )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                          Father: {state.SelectedLitter.Father}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Mother: {state.SelectedLitter.Mother}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Cage: {state.SelectedLitter.Cage}
                        </ListGroup.Item>
                      </ListGroup>
                      <Button onClick={() => setEditLitterShow(true)}>
                        Edit
                      </Button>
                      <Container style={{ border: "1px solid black" }}>
                        <Line options={options2} data={data2} />
                      </Container>
                    </Card.Body>
                    <Card.Footer className="text-muted"></Card.Footer>
                  </Card>
                </Col>
                <Col>
                  <Card data-bs-theme="dark" style={{ width: "18rem" }}>
                    <Card.Header>Kids</Card.Header>
                    <Container
                      style={{
                        overflow: "auto",
                        height: "200px",
                        border: "1px solid black",
                      }}
                    >
                      <Button
                        onClick={() => {
                          setaddKidShow(true);
                        }}
                      >
                        Add Kid
                      </Button>
                      <Row>
                        {state.SelectedLitterKids.map((kid) => ({
                          ...(kid.Processed ? (
                            <Card
                              data-bs-theme="dark"
                              style={{
                                "background-color": "red",
                                width: "8rem",
                              }}
                              className="text-centered my-1 mx-1 p-1 "
                              onClick={() => handleKidCardClick(kid.KidID)}
                              key={kid.id}
                            >
                              <Card.Header>Kid ID: {kid.KidID} </Card.Header>
                            </Card>
                          ) : (
                            <Card
                              data-bs-theme="dark"
                              style={{
                                "background-color": "grey",
                                width: "8rem",
                              }}
                              className="text-centered my-1 mx-1 p-1 "
                              onClick={() => handleKidCardClick(kid.KidID)}
                              key={kid.id}
                            >
                              <Card.Header>Kid ID: {kid.KidID} </Card.Header>
                            </Card>
                          )),
                        }))}
                      </Row>
                    </Container>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col></Col>
          <Col sm={5} style={{ "background-color": "grey" }}>
            <Container>
              <Row>
                <Card
                  data-bs-theme="dark"
                  className="text-center z"
                  style={{ border: "1px solid black" }}
                >
                  <Card.Header>Kid ID: {state.SelectedKid.KidID}</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col>
                        <Card.Title></Card.Title>
                        <Card.Body>
                          <Card.Title
                            onClick={() => {
                              seteditKidShow(true);
                            }}
                          >
                            Sex: {state.SelectedKid.Sex}
                          </Card.Title>
                          <Card.Title>
                            Birth Weight: {state.SelectedKid.BirthWeight}
                          </Card.Title>
                          <Card.Title>
                            Current Status: {state.SelectedKid.Status}
                          </Card.Title>
                        </Card.Body>
                        <ButtonGroup aria-label="Basic example">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              changeKidToGRowing();
                            }}
                          >
                            Growing
                          </Button>
                          <DropdownButton
                            as={ButtonGroup}
                            title="Add"
                            id="bg-nested-dropdown"
                          >
                            <Dropdown.Item
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setaddWeightKidShow(true);
                              }}
                            >
                              Add Weight
                            </Dropdown.Item>
                            <Dropdown.Item
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setaddBirthWeightKidShow(true);
                              }}
                            >
                              Add Birth Weight
                            </Dropdown.Item>
                            <Dropdown.Item
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setaddNoteKidShow(true);
                              }}
                            >
                              Add Note
                            </Dropdown.Item>
                          </DropdownButton>
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
                      </Col>
                      <Col>
                        <Line options={options} data={data} />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                <br />
                <br />
                <Card
                  className="text-center"
                  data-bs-theme="dark"
                  style={{
                    border: "1px solid black",
                    height: "300px",
                    overflow: "auto",
                  }}
                >
                  <Card.Header>Notes</Card.Header>
                  {selectedKidNotes.map((note) => (
                    <Card.Body>
                      <Card className="text-center" data-bs-theme="dark">
                        <Card.Header>
                          {Moment(note.Date).format("MM/DD/YY")} @{" "}
                          {Moment(note.Date).format("HH:mm a")}
                        </Card.Header>
                        <Card.Body>
                          <Card.Title>{note.Title}</Card.Title>
                          <Card.Text>{note.Note}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Card.Body>
                  ))}
                  <Card.Footer className="text-muted"></Card.Footer>
                </Card>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
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
        show={state.showLitterEditModal}
        onHide={() => setEditLitterShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>Edit Litter</h4>

          <Form onSubmit={handleLitterEdit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Breed">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={state.SelectedLitter.LitterID}
                  name="LitterID"
                  onChange={handleLitterChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Cage">
                <Form.Label>Cage</Form.Label>

                <Form.Select
                  aria-label="Cage"
                  name="Cage"
                  value={state.SelectedLitter.Cage}
                  onChange={handleLitterChange}
                >
                  <option
                    value={state.SelectedLitter.Cage}
                    key={state.SelectedLitter.Cage}
                  >
                    {state.SelectedLitter.Cage}
                  </option>
                  {Cages.map((cage) => (
                    <option value={cage} key={cage}>
                      {cage}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} controlId="Bred">
                <Form.Label>Bred</Form.Label>
                <Form.Control
                  controlId="Bred"
                  type="date"
                  name="Bred"
                  onChange={handleLitterChange}
                />
                <Form.Text>
                  Current:{" "}
                  {Moment(state.SelectedLitter.Bred).format("MM/DD/YYYY")}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="Born">
                <Form.Label>Born</Form.Label>

                <Form.Control
                  controlId="Born"
                  type="date"
                  name="Born"
                  onChange={handleLitterChange}
                />
                <Form.Text>
                  Current:{" "}
                  {Moment(state.SelectedLitter.Born).format("MM/DD/YYYY")}
                </Form.Text>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="Mother"
                onChange={handleLitterChange}
              >
                <Form.Label>Mother</Form.Label>
                <Form.Select aria-label="Mother" name="Mother">
                  <option
                    value={state.SelectedLitter.Mother}
                    key={state.SelectedLitter.Mother}
                  >
                    {state.SelectedLitter.Mother}
                  </option>
                  {Does.map((doe) => (
                    <option value={doe} key={doe}>
                      {doe}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="Father"
                onChange={handleLitterChange}
              >
                <Form.Label>Father</Form.Label>
                <Form.Select aria-label="Father" name="Father">
                  <option
                    value={state.SelectedLitter.Father}
                    key={state.SelectedLitter.Father}
                  >
                    {state.SelectedLitter.Father}
                  </option>

                  {Bucks.map((buck) => (
                    <option value={buck} key={buck}>
                      {buck}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit">
              Edit Litter
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <Modal
        show={editKidShow}
        onHide={() => seteditKidShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>Edit Sex</h4>

          <Form onSubmit={handleKidEdit}>
            <Form.Group as={Col} controlId="Breed">
              <Form.Label>Sex</Form.Label>
              <Form.Select
                name="Sex"
                value={state.SelectedRabbit.Sex}
                onChange={handleEditKidChange}
              >
                <option value="" key=""></option>
                {SexType.map((sex) => (
                  <option value={sex} key={sex}>
                    {sex}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      
      <Modal
        show={state.showLitterNewModal}
        onHide={() => setNewLitterShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>New Litter</h4>

          <Form onSubmit={handleLitterSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Breed">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="LitterID"
                  onChange={handleLitterChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Bred">
                <Form.Label>Bred</Form.Label>
                <br></br>
                <Form.Control
                  disabled
                  type="text"
                  placeholder="Bred"
                  name="Bred"
                  value=""
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Born">
                <Form.Label>Born</Form.Label>
                <Form.Control
                  controlId="Born"
                  type="date"
                  placeholder="Date"
                  name="Born"
                  onChange={handleLitterChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="Mother"
                onChange={handleLitterChange}
              >
                <Form.Label>Mother</Form.Label>
                <Form.Select aria-label="Mother" name="Mother" value="">
                  <option value="" key="">
                    ""
                  </option>
                  {Does.map((doe) => (
                    <option value={doe} key={doe}>
                      {doe}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="Father"
                onChange={handleLitterChange}
              >
                <Form.Label>Father</Form.Label>
                <Form.Select aria-label="Father" name="Father" value="">
                  <option value="" key="">
                    ""
                  </option>
                  {Bucks.map((buck) => (
                    <option value={buck} key={buck}>
                      {buck}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3"></Row>
            <Button variant="primary " onClick={() => addKidForm()}>
              Add Kid
            </Button>
            <br />
            <Card border="primary border-5">
              <Card.Body>
                <Card.Title>Kids</Card.Title>
                <Row>
                  {items.map((item, index) => (
                    <Col>
                      <Card
                        border="scondary border-5"
                        style={{ width: "14rem" }}
                      >
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>KidID</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="KidID"
                            id={item.KidID}
                          />
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicCheckbox"
                        >
                          <Form.Label>Sex</Form.Label>
                          <Form.Select
                            aria-label="Sex"
                            name="Sex"
                            id={item.Sex}
                          >
                            <option>Choose</option>
                            <option value="Not Sexed">Not Sexed</option>
                            <option value="Buck">Buck</option>
                            <option value="Doe">Doe</option>
                          </Form.Select>
                        </Form.Group>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
            <Button variant="primary" type="submit">
              Add Litter
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
                id="KidsNewWeight"
                step="0.01"
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
        show={addBirthWeightKidShow}
        onHide={() => setaddBirthWeightKidShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Birth Weight
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleKidAddBirthWeight}>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                placeholder="Weight"
                name="Weight"
                id="KidsNewBirthWeight"
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
      <Modal
        show={addKidShow}
        onHide={() => setaddKidShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add Kid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleKidAdd}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="KidID"
                name="KidID"
                id="newKidID"
              />
              <InputGroup.Text id="basic-addon3">Kid ID</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
              <Form.Select aria-label="Sex" name="Sex" id="newKidSex">
                <option>Choose</option>
                <option value="Not Sexed">Not Sexed</option>
                <option value="Buck">Buck</option>
                <option value="Doe">Doe</option>
              </Form.Select>
              <InputGroup.Text id="basic-addon3">Sex</InputGroup.Text>
            </InputGroup>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Label>Sex</Form.Label>
            </Form.Group>
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
