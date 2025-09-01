import Col from "react-bootstrap/Col";
import React, { useContext, useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { GlobalContext } from "../contexts/globalContext";
import { state } from "../contexts/globalContext";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Moment from "moment";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Stack from "react-bootstrap/Stack";
import Rabbits from "../components/Rabbits";
import Tasks from "../components/Tasks";
import Litters from "../components/Litters";
import Breeders from "../components/Breeders";
import GrowingKids from "../components/Growing";
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
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [state, dispatch] = useContext(GlobalContext);
  const [getFile, setgetFile] = useState(null);

  const getRabbitBreed = (cageToFind) => {
    let itemsToSearch = state.Rabbits;
    const foundItem = itemsToSearch.find((item) => item.Cage === cageToFind);

    if (!foundItem) {
      return false;
    }
    if (!foundItem.Name) {
      return false;
    } else {
      console.log(foundItem.ReadyToBreed);
      return foundItem.ReadyToBreed;
    }
  };

  const getCageLitter = (cageToFind) => {
    let itemsToSearch = state.Litters;
    const foundItem = itemsToSearch.find((item) => item.Cage === cageToFind);
    console.log(foundItem);
    if (!foundItem) {
      return "NADA";
    }
    if (!foundItem.LitterID) {
    } else {
      return foundItem.LitterID;
    }
  };

  const getCageRabbit = (cageToFind) => {
    let itemsToSearch = state.Rabbits;
    const foundItem = itemsToSearch.find((item) => item.Cage === cageToFind);

    if (!foundItem) {
      return "NADA";
    }
    if (!foundItem.Name) {
    } else {
      return foundItem.Name;
    }
  };
  const getRabbitItemByName = (nameToFind) => {
    let itemsToSearch = state.Rabbits;
    const foundItem = itemsToSearch.find((item) => item.Name === nameToFind);
    return foundItem; // Returns the first matching object or undefined
  };
  const getBreederByName = (nameToFind) => {
    console.log(nameToFind);
    let breederToSearch = state.Breeders;
    const foundBreeder = breederToSearch.filter(
      (item) => item.Name === nameToFind
    );
    return foundBreeder; // Returns the first matching object or undefined
  };
  const getRabbitTasksByName = (nameToFind) => {
    let tasksToSearch = state.Tasks;
    const foundTasks = tasksToSearch.filter(
      (item) => item.Rabbit === nameToFind && item.Completed === false
    );
    return foundTasks; // Returns the first matching object or undefined
  };
  const getLitters = (nameToFind) => {
    let itemsToSearch = state.Litters;
    const foundItem = itemsToSearch.find(
      (item) => item.LitterID === nameToFind
    );
    return foundItem; // Returns the first matching object or undefined
  };
  const getGrowingKid = (KidToFind) => {
    let itemsToSearch = state.GrowingRabbits;
    const foundItem = itemsToSearch.find((item) => item.KidID === KidToFind);
    return foundItem; // Returns the first matching object or undefined
  };

  useEffect(() => {
    const getGrowingKid = (KidToFind) => {
      let itemsToSearch = state.GrowingRabbits;
      const foundItem = itemsToSearch.find((item) => item.KidID === KidToFind);
      return foundItem; // Returns the first matching object or undefined
    };
    getGrowingKid(state.selectedG);
  }, [state.reloadSelectedDrowingRabbit]);
  const handleGrowingKidClicked = (kid) => {
    let labels = [];
    let weightData = [];
    let kidItem = getGrowingKid(kid);
    let kidWeights = kidItem.CurrentWeight;
    console.log(kidItem);
    const litterItem = getLitters(kidItem.LitterID);
    console.log(litterItem);
    kidWeights.map((weight) => {
      let date = Moment(weight.Date).format("MM/DD");
      labels.push(date);
      weightData.push(weight.Weight);
      return date;
    });

    dispatch({
      type: "SelectedGrowingKid",
      payload: kidItem,
    });
    dispatch({
      type: "SelectedGrowingKidWeights",
      payload: weightData,
    });
    dispatch({
      type: "SelectedGrowingKidLables",
      payload: labels,
    });
    dispatch({
      type: "SelectedGrowingKidNotes",
      payload: kidItem.Notes,
    });
    dispatch({
      type: "SelectedGrowingKidTasks",
      payload: kidItem.Tasks,
    });
    dispatch({
      type: "SelectedLitter",
      payload: litterItem,
    });
    dispatch({
      type: "showGrowing",
      payload: true,
    });
    dispatch({
      type: "GrowingKidSelected",
      payload: true,
    });
  };

  const handleLitterCardClick = (litter) => {
    console.log("Card clicked!" + litter);
    const litterItem = getLitters(litter);
    console.log(litterItem);
    dispatch({
      type: "showTasks",
      payload: false,
    });
    dispatch({
      type: "showRabbits",
      payload: false,
    });
    dispatch({
      type: "showLitters",
      payload: true,
    });
    dispatch({
      type: "SelectedLitter",
      payload: litterItem,
    });
    dispatch({
      type: "SelectedLitterKids",
      payload: litterItem.Kids,
    });
  };

  const handleBreederClick = (breeder) => {
    let selectedBreeder = getBreederByName(breeder);
    console.log(selectedBreeder);
    console.log(selectedBreeder[0]);
    dispatch({
      type: "selectedBreeder",
      payload: selectedBreeder[0],
    });
    dispatch({
      type: "showBreeders",
      payload: true,
    });
  };
  const handleCardClick = (rabbit) => {
    console.log("Card clicked!" + rabbit); //GET TASKS FOR RABBIT HERE

    axios
      .get("http://192.168.0.156:3000/database/getRabbit/" + rabbit)
      .then((response) => {
        let data = response.data;
        console.log(data);
        let itemsToSearch = state.Breeders;
        const foundBreeded = itemsToSearch.find(
          (item) => item.Name === data[0].Breeder
        );
        console.log(foundBreeded);
        dispatch({
          type: "selectedBreeder",
          payload: foundBreeded,
        });
        let latestWeight =
          data[0].CurrentWeight[data[0].CurrentWeight.length - 1];
        //console.log(latestWeight.Weight)
        try {
          dispatch({
            type: "SelectedRabbitCurrentWeight",
            payload: latestWeight.Weight,
          });
          dispatch({
            type: "BreededSelected",
            payload: true,
          });
        } catch (error) {}

        //setgetFile(`http://192.168.0.156:3000/Files/` +  data.FileName);

        axios
          .get("http://192.168.0.156:3000/database/getRabbitLitters/" + rabbit)
          .then((response2) => {
            let data2 = response2.data;
            console.log(data2);
            dispatch({
              type: "SelectedRabbitsLitters",
              payload: data2,
            });
            dispatch({
              type: "showRabbits",
              payload: true,
            });
          });

        console.log(state);
        return "ff";
      })
      .catch((error) => {
        // Handle any errors during the request
        console.error("Error fetching data:", error);
      });

    const SelectedrabbitItem = getRabbitItemByName(rabbit);
    const SelectedrabbitTasks = getRabbitTasksByName(rabbit);

    console.log(SelectedrabbitItem);
    console.log(SelectedrabbitTasks);
    dispatch({
      type: "SelectedRabbit",
      payload: SelectedrabbitItem,
    });
    dispatch({
      type: "SelectedRabbitNotes",
      payload: SelectedrabbitItem.Notes,
    });
    dispatch({
      type: "SelectedRabbitTasks",
      payload: SelectedrabbitTasks,
    });
    dispatch({
      type: "showRabbitInfo",
      payload: true,
    });
  };

  const HomePage = () => {
    return (
      <Container>
        <br />
        <Container>
          <Card data-bs-theme="dark" className="text-center">
            <Card.Title>Rabbit Cages</Card.Title>
            <Row className="g-0">
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("1"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 1</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("1")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("1") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("2"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 2</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("2")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("2") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("3"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 3</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("3")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("3") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("4"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 4</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("4")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("4") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("5"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 5</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("5")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("5") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("6"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 6</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("6")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("6") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("7"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 7</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("7")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("7") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("8"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 8</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("8")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("8") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("9"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 9</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("9")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("9") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleCardClick(getCageRabbit("10"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 10</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageRabbit("10")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("10") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Card>
          <br />
          <Card data-bs-theme="dark" className="text-center">
            <Card.Title>Grow Out Cages</Card.Title>
            <Row className="g-0">
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleLitterCardClick(getCageLitter("Growing1"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 1</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageLitter("Growing1")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("Growing1") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleLitterCardClick(getCageLitter("Growing2"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 2</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageLitter("Growing2")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("Growing2") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleLitterCardClick(getCageLitter("Growing1"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 3</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageLitter("Growing3")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("Growing3") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
              <Col md={2} className="m-1">
                <Card
                  onClick={() => {
                    handleLitterCardClick(getCageLitter("Growing4"));
                  }}
                  data-bs-theme="dark"
                  className="text-center"
                >
                  <Card.Header>Cage 4</Card.Header>
                  <Card.Body>
                    <Card.Text>{getCageLitter("Growing4")}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {getRabbitBreed("Growing4") ? "Ready To Breed" : ""}
                  </Card.Footer>
                </Card>
              </Col>
            </Row>
          </Card>
        </Container>
        <br />
        <Container>
          <Row>
            <Card data-bs-theme="dark" className="text-center">
              <Card.Title>Tasks</Card.Title>
              <Card.Body>
                <Container>
                  <Row>
                    <Col sm>
                      <Card data-bs-theme="dark" className="text-center">
                        <Card.Title>Yesterday</Card.Title>
                        <ListGroup>
                          {state.weeklyViewTasks.yesterday.map((todaytask) => (
                            <ListGroup.Item key={todaytask.id}>
                              {todaytask.Title}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
                    </Col>
                    <Col sm>
                      <Card data-bs-theme="dark" className="text-center">
                        <Card.Title>Today</Card.Title>
                        <ListGroup>
                          {state.weeklyViewTasks.today1.map((todaytask) => (
                            <ListGroup.Item key={todaytask.id}>
                              {todaytask.Title}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
                    </Col>
                    <Col sm>
                      <Card data-bs-theme="dark" className="text-center">
                        <Card.Title>Tomorrow</Card.Title>
                        <ListGroup>
                          {state.weeklyViewTasks.today2.map((todaytask2) => (
                            <ListGroup.Item key={todaytask2.id}>
                              {todaytask2.Title}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
                    </Col>
                    <Col sm>
                      <Card data-bs-theme="dark" className="text-center">
                        <Card.Title>In 2 Days</Card.Title>
                        <ListGroup>
                          {state.weeklyViewTasks.today3.map((todaytask3) => (
                            <ListGroup.Item key={todaytask3.id}>
                              {todaytask3.Title}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
                    </Col>
                    <Col sm>
                      <Card data-bs-theme="dark" className="text-center">
                        <Card.Title>In 3 Days</Card.Title>
                        <ListGroup>
                          {state.weeklyViewTasks.today4.map((todaytask3) => (
                            <ListGroup.Item key={todaytask3.id}>
                              {todaytask3.Title}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </Card.Body>
            </Card>
          </Row>
          <br />
          <Row>
            <Col sm>
              <div>
                <Card data-bs-theme="dark" className="text-center">
                  <Card.Header>Grow Box</Card.Header>
                  <Card.Body>
                    <Row>
                      {state.GrowingRabbits.map((kid) => (
                        <Col sm={2} key={kid.KidID}>
                          <Card
                            key={kid.KidID}
                            onClick={() => {
                              handleGrowingKidClicked(kid.KidID);
                            }}
                          >
                            {kid.KidID}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col sm>
              <Card data-bs-theme="dark" className="text-center">
                <Card.Header>Notifications</Card.Header>
                <Card.Body>
                  {state.ReadyToBreed.map((breed) => (
                    <Card>
                      <Card.Body>
                        {breed.Rabbit} is {breed.Days}
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
                <Card.Footer className="text-muted"></Card.Footer>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  };

  function showLitterModal() {
    dispatch({
      type: "showLitterNewModal",
      payload: true,
    });
  }

  function setAddWeightsShow(val) {
    dispatch({
      type: "showAddWeightsModal",
      payload: val,
    });
  }
  function setNewBreederShow(val) {
    dispatch({
      type: "showBreederNewModal",
      payload: val,
    });
  }
  function setNewRabbitShow(val) {
    dispatch({
      type: "showNewRabbitModal",
      payload: val,
    });
  }
  useEffect(() => {
    if (state.reloadSelectdGrowing === true){
      console.log(state.SelectedGrowingKid.KidID);

     handleGrowingKidClicked(state.SelectedGrowingKid.KidID);


    }
  }, [state.reloadSelectdGrowing]);

  return (
    <>
      <Row
        className="m-0 "
        style={{ height: "800px", border: "1px solid black" }}
      >
        <Col
          xs={12}
          md={6}
          lg={3}
          style={{ backgroundColor: "grey" }}
          data-bs-theme="dark"
          flush="true"
        >
          <br />
          <Card className="text-center" style={{ border: "1px solid black" }}>
            <Card.Img
              variant="top"
              className="weatherIcon"
              src={state.weatherData.weatherIcon}
            ></Card.Img>
            <Card.Text>
              {state.weatherData.weather[0].description}
              <br />
              Feels Like {state.weatherData.main.feels_like}
              <br />
              High: {Math.round(state.weatherData.main.temp_max)}
              Low: {Math.round(state.weatherData.main.temp_min)}
            </Card.Text>
            <Card.Footer>
              <DropdownButton
                as={ButtonGroup}
                title="Add"
                id="bg-nested-dropdown"
                style={{ height: "40%" }}
              >
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => setNewRabbitShow(true)}
                >
                  {" "}
                  Rabbit
                </Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={() => showLitterModal()}>
                  {" "}
                  Litter
                </Dropdown.Item>
                <Dropdown.Item eventKey="3"> Task</Dropdown.Item>
                <Dropdown.Item
                  eventKey="4"
                  onClick={() => setNewBreederShow(true)}
                >
                  {" "}
                  Breeder
                </Dropdown.Item>
                <Dropdown.Item eventKey="3"> Task</Dropdown.Item>
                <Dropdown.Item
                  eventKey="4"
                  onClick={() => setAddWeightsShow(true)}
                >
                  {" "}
                  Weights
                </Dropdown.Item>
              </DropdownButton>
            </Card.Footer>
          </Card>

          <Accordion flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header
                onClick={() => {
                  dispatch({
                    type: "showLitters",
                    payload: false,
                  });
                  dispatch({
                    type: "showRabbits",
                    payload: false,
                  });
                  dispatch({
                    type: "showTasks",
                    payload: true,
                  });
                }}
              >
                Tasks
              </Accordion.Header>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Growing</Accordion.Header>
              <Accordion.Body>
                <ListGroup as="ul" variant="flush">
                  {state.GrowingRabbits.map((gowingRabbit) => (
                    <ListGroup.Item
                      as="li"
                      key={gowingRabbit.KidID}
                      onClick={() => {
                        handleGrowingKidClicked(gowingRabbit.KidID);
                      }}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">ID: {gowingRabbit.KidID}</div>
                      </div>
                      {Moment().diff(gowingRabbit.Born, "days")} Days
                      <br />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Litters</Accordion.Header>
              <Accordion.Body style={{ height: "300px", overflowX: "hidden" }}>
                <ListGroup as="ul">
                  {state.Litters.map((litter) => (
                    <ListGroup.Item
                      key={litter.id}
                      onClick={() => handleLitterCardClick(litter.LitterID)}
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{litter.LitterID} </div>
                      </div>
                      {Moment().diff(litter.Born, "days")} Days
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Rabbits</Accordion.Header>
              <Accordion.Body style={{ height: "300px", overflowX: "hidden" }}>
                <ListGroup variant="flush">
                  {state.Rabbits.map((rabbit) => (
                    <ListGroup.Item
                      variant="light"
                      onClick={() => handleCardClick(rabbit.Name)}
                      key={rabbit.id}
                    >
                      {rabbit.Name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header onClick={() => handleBreederClick()}>
                Breeders
              </Accordion.Header>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col style={{ backgroundColor: "grey" }}>
          {state.showGrowing && <GrowingKids />}
          {state.showHome && <HomePage />}
          {state.showRabbits && <Rabbits />}
          {state.showTasks && <Tasks />}
          {state.showLitters && <Litters />}
          {state.showBreeders && <Breeders />}
        </Col>
      </Row>
    </>
  );
}
