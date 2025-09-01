import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import React, { useContext, useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Container from "react-bootstrap/Container";
import { GlobalContext } from "../contexts/globalContext";
import axios from "axios";
import Moment from "moment";

export default function Tasks() {
  const [state, dispatch] = useContext(GlobalContext);
  const [breederinputs, setBreederInputs] = useState();
  const [PurchaseInputs, setPurchaseInputs] = useState();

  const handleEditBreederSubmit = (event) => {
    event.preventDefault();
    function createFormItem(item) {
      breederinputs.Breeder = state.selectedBreeder.Name;
      let editBreederFormData = { breederinputs };

      const response = axios.post(
        "http://192.168.196.4:3000/database/editbreeder",
        editBreederFormData
      );
      console.log(response);
    }

    createFormItem();
  };
  const handleNewPurchasSubmit = (event) => {
    event.preventDefault();

    function createFormItem(item) {
      let newPurchaseFormData = { PurchaseInputs };

      const response = axios.post(
        "http://192.168.196.4:3000/database/addPurchase/" +
          state.selectedBreeder.id,
        newPurchaseFormData
      );
      console.log(response);
    }

    createFormItem();
  };
  const handleBreederSubmit = (event) => {
    event.preventDefault();

    function createFormItem(item) {
      let newBreederFormData = { breederinputs };

      const response = axios.post(
        "http://192.168.196.4:3000/database/newbreeder",
        newBreederFormData
      );
      console.log(response);
    }

    createFormItem();
  };

  const handlePurchaseChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    let value = event.target.value;
    console.log(name);
    setPurchaseInputs((values) => ({ ...values, [name]: value }));
  };
  const handleBreederChange = (event) => {
    event.preventDefault();
    const name = event.target.name;
    let value = event.target.value;

    setBreederInputs((values) => ({ ...values, [name]: value }));
  };

  function setEditBreederShow(val) {
    dispatch({
      type: "showBreederEditModal",
      payload: val,
    });
  }
  function setNewBreederShow(val) {
    dispatch({
      type: "showBreederNewModal",
      payload: val,
    });
  }

  function setAddPurchaseShow(val) {
    dispatch({
      type: "AddPurchaseShow",
      payload: val,
    });
  }
  function setEditBreederShow(val) {
    dispatch({
      type: "showBreederEditModal",
      payload: val,
    });
  }

  function selectedBreeder(breeder) {
    let itemsToSearch = state.Breeders;
    console.log(breeder);
    const foundItem = itemsToSearch.find((item) => item.Name === breeder);
    console.log(foundItem.Purchases);
    dispatch({
      type: "selectedBreeder",
      payload: foundItem,
    });
    dispatch({
      type: "BreedersSelectPurchases",
      payload: foundItem.Purchases,
    });

    dispatch({
      type: "BreededSelected",
      payload: true,
    });
  }
  console.log(state);
  return (
    <>
      <Container fluid>
        <Container className=" my-3 mx-2 p-1 ">
          <Row>
            <Col>
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Farm</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {state.Breeders.map((breeder) => (
                    <tr
                      key={breeder.Name}
                      onClick={() => {
                        selectedBreeder(breeder.Name);
                      }}
                    >
                      <td>{breeder.Name}</td>
                      <td>{breeder.Farm}</td>
                      <td>{breeder.Email}</td>
                      <td>{breeder.Phone}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col>
              {state.BreededSelected && (
                <Card
                  className="text-center my-3 mx-2 p-1"
                  data-bs-theme="dark"
                >
                  <Card.Header>{state.selectedBreeder.Name}</Card.Header>

                  <Card.Body>
                    <Table striped size="sm" responsive>
                      <tbody>
                        <tr>
                          <td>Address</td>
                          <td colSpan={2}>
                            <p className="card-text text-muted">
                              {state.selectedBreeder.Address}
                            </p>
                            <p className="card-text text-muted">
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
                    <ButtonGroup aria-label="Basic example">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditBreederShow(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setAddPurchaseShow(true);
                        }}
                      >
                        Add Purchase
                      </Button>
                    </ButtonGroup>
                  </Card.Body>
                  <Card.Body>
                    <Card.Title>Note</Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        {state.selectedBreeder.Note}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                  <Card.Footer>
                    Purchases
                    <Table striped>
                      <thead>
                        <tr>
                          <th>Rabbit</th>
                          <th>Purchased</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.BreedersSelectPurchases.map((purchase) => (
                          <tr>
                            <td>{purchase.Rabbit}</td>
                            <td>
                              {Moment(purchase.Purchased)
                                .local()
                                .format("MM/DD/YY")}
                            </td>
                            <td>${purchase.Cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Footer>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
      <Modal
        show={state.showBreederEditModal}
        onHide={() => setEditBreederShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>New Breeder</h4>

          <Form onSubmit={handleBreederSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="Name"
                  onChange={handleBreederChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Farm">
                <Form.Label>Farm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Farm"
                  name="Farm"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="Address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  name="Address"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="City">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  name="City"
                  onChange={handleBreederChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="State">
                <Form.Label>State</Form.Label>
                <Form.Select name="State" onChange={handleBreederChange}>
                  <option value="" selected="selected">
                    Select a State
                  </option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="Breed">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Zip"
                  name="Zip"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  name="Email"
                  onChange={handleBreederChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="Phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  name="Phone"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="Note">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  type="textarea"
                  rows={5}
                  name="Note"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Add Breeder
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      {state.BreededSelected && (
        <Modal
          show={state.showBreederEditModal}
          onHide={() => setEditBreederShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h4>Edit Breeder</h4>

            <Form onSubmit={handleEditBreederSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="Name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={state.selectedBreeder.Name}
                    name="Name"
                    onChange={handleBreederChange}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="Farm">
                  <Form.Label>Farm</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={state.selectedBreeder.Farm}
                    name="Farm"
                    onChange={handleBreederChange}
                  />
                </Form.Group>
              </Row>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="Address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={state.selectedBreeder.Address}
                    name="Address"
                    onChange={handleBreederChange}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="City">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={state.selectedBreeder.City}
                    name="City"
                    onChange={handleBreederChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="State">
                  <Form.Label>State</Form.Label>
                  <Form.Select name="State" onChange={handleBreederChange}>
                    <option
                      value={state.selectedBreeder.State}
                      selected="selected"
                    >
                      {state.selectedBreeder.State}
                    </option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="Breed">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={state.selectedBreeder.Zip}
                    name="Zip"
                    onChange={handleBreederChange}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="Email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={state.selectedBreeder.Email}
                    name="Email"
                    onChange={handleBreederChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="Phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={state.selectedBreeder.Phone}
                    name="Phone"
                    onChange={handleBreederChange}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="Note">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="Note"
                    placeholder={state.selectedBreeder.Note}
                    onChange={handleBreederChange}
                  />
                </Form.Group>
              </Row>
              <Button variant="primary" type="submit">
                Edit Breeder
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      )}
      <Modal
        show={state.showBreederNewModal}
        onHide={() => setNewBreederShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>New Breeder</h4>

          <Form onSubmit={handleBreederSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="Name"
                  onChange={handleBreederChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Farm">
                <Form.Label>Farm</Form.Label>
                <Form.Control
                  type="text"
                  name="Farm"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="Address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="Address"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="City">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="City"
                  onChange={handleBreederChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="State">
                <Form.Label>State</Form.Label>
                <Form.Select name="State" onChange={handleBreederChange}>
                  <option selected="selected">CHOOSE</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="Breed">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="text"
                  name="Zip"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="Email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="Email"
                  onChange={handleBreederChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="Phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="Phone"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group controlId="Note">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="Note"
                  onChange={handleBreederChange}
                />
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Edit Breeder
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        show={state.AddPurchaseShow}
        onHide={() => setAddPurchaseShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>New Purchase</h4>

          <Form onSubmit={handleNewPurchasSubmit}>
            <Row className="mb-3">
              <Form.Group
                as={Col}
                controlId="Rabbit"
                onChange={handlePurchaseChange}
              >
                <Form.Label>Rabbit</Form.Label>
                <Form.Select aria-label="Rabbit" name="Rabbit">
                  <option></option>
                  {state.Rabbits.map((rabbit) => (
                    <option value={rabbit.Name} key={rabbit.Name}>
                      {rabbit.Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} controlId="Purchased">
                <Form.Label>Purchased</Form.Label>
                <Form.Control
                  type="date"
                  name="Purchased"
                  onChange={handlePurchaseChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="Cost">
                <Form.Label>Cost</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Cost"
                  name="Cost"
                  step="0.01"
                  onChange={handlePurchaseChange}
                />
              </Form.Group>
            </Row>

            <Button variant="primary" type="submit">
              Add Purchase
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
