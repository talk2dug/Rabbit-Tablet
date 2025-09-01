import Col from "react-bootstrap/Col";
import React, { useContext, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { GlobalContext } from "../contexts/globalContext";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Moment from "moment";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Table from "react-bootstrap/Table";

export default function Tasks() {
  const [state, dispatch] = useContext(GlobalContext);
  const [HistoryValue, setHistoryValue] = useState(null);

  const setTaskItemCompleted = (id, completed) => {
    console.log(id);
    let sendData = {
      History: HistoryValue,
      Completed: completed,
      id: state.selectedTask.id,
    };

    const response = axios.post(
      "http://192.168.0.156:3000/database/updateTask",
      sendData
    );
    console.log(response);
    dispatch({
      type: "reloadRabbits",
      payload: true,
    });
    dispatch({
      type: "showTaskItemModal",
      payload: false,
    });
  };

  useEffect(() => {
    console.log(state.selectedTask);
    console.log(state);
  });

  const setTaskItemShow = (val, itemID) => {
    if (val === false) {
      dispatch({
        type: "showTaskItemModal",
        payload: val,
      });
    }
    if (val === true) {
      const findItemByName = (idToFind) => {
        const foundItem = state.Tasks.find((item) => item._id === idToFind);
        console.log(foundItem);
        return foundItem;
        // Will be the item object or undefined
      };
      function getTask(itemID) {
        console.log(findItemByName(itemID));
        dispatch({
          type: "selectedTask",
          payload: findItemByName(itemID),
        });
        dispatch({
          type: "showTaskItemModal",
          payload: val,
        });
      }

      getTask(itemID);
    }
  };
  const handleTaskChange = (event) => {
    setHistoryValue(event.target.value);
  };

  return (
    <>
      <br />
      <Container
        fluid
        className="homeContainer"
        style={{
          width: "100%",
          "background-color": "grey",
          height: "800px",
          overflowX: "scroll",
        }}
      >
        <Accordion defaultActiveKey="0" flush data-bs-theme="dark">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Past Due</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover fluid class="table-fixed">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Title</th>
                    <th style={{ width: "7%" }}>Due</th>
                    <th style={{ width: "10%" }}>Rabbit</th>
                    <th style={{ width: "35%" }}>Note</th>
                    <th style={{ width: "4%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {state.PastTasks.map((task) => (
                    <tr>
                      <td>{task.Title}</td>
                      <td>{Moment(task.Due).format("dddd")}</td>
                      <td>{task.Rabbit}</td>
                      <td
                        style={{
                          width: "10%",
                          wordWrap:
                            "break-word;min-width: 160px;max-width: 160px",
                        }}
                      >
                        {task.Note}
                      </td>
                      <td>
                        <Button
                          onClick={() => setTaskItemShow(true, task.id)}
                        ></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Todays Tasks</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Title</th>
                    <th style={{ width: "7%" }}>Due</th>
                    <th style={{ width: "10%" }}>Rabbit</th>
                    <th style={{ width: "35%" }}>Note</th>
                    <th style={{ width: "4%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {state.TodaysTasks.map((task) => (
                    <tr class="w-25">
                      <td>{task.Title}</td>
                      <td>{Moment(task.Due).format("dddd")}</td>
                      <td>{task.Rabbit}</td>
                      <td
                        style={{
                          width: "10%",
                          wordWrap:
                            "break-word;min-width: 160px;max-width: 160px",
                        }}
                      >
                        {task.Note}
                      </td>
                      <td>
                        <Button
                          onClick={() => setTaskItemShow(true, task.id)}
                        ></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Future Tasks</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Title</th>
                    <th style={{ width: "7%" }}>Due</th>
                    <th style={{ width: "10%" }}>Rabbit</th>
                    <th style={{ width: "35%" }}>Note</th>
                    <th style={{ width: "4%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {state.FutureTasks.map((task) => (
                    <tr>
                      <td>{task.Title}</td>
                      <td>{Moment(task.Due).format("MM/DD")}</td>
                      <td>{task.Rabbit}</td>
                      <td
                        style={{
                          width: "10%",
                          wordWrap:
                            "break-word;min-width: 160px;max-width: 100px",
                        }}
                      >
                        {task.Note}
                      </td>
                      <td>
                        <Button onClick={() => setTaskItemShow(true, task.id)}>
                          Completed
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Completed Tasks</Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>Title</th>
                    <th style={{ width: "7%" }}>Due</th>
                    <th style={{ width: "10%" }}>Rabbit</th>
                    <th style={{ width: "35%" }}>Note</th>
                    <th style={{ width: "4%" }}></th>

                    <th>Date Complete</th>
                  </tr>
                </thead>
                <tbody>
                  {state.completedTasks.map((task) => (
                    <tr
                      onClick={() => {
                        setTaskItemShow(true, task.id);
                      }}
                    >
                      <td>{task.Title}</td>
                      <td>{Moment(task.Due).format("MM/DD/YY")}</td>
                      <td>{task.Rabbit}</td>
                      <td
                        style={{
                          width: "10%",
                          wordWrap:
                            "break-word;min-width: 160px;max-width: 160px",
                        }}
                      >
                        {task.Note}
                      </td>
                      <td>{Moment(task.Date_Completed).format("MM/DD/YY")}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Modal
          show={state.showTaskItemModal}
          onHide={() => setTaskItemShow(false)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          data-bs-theme="dark"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{state.selectedTask.Title}</h4>
            <p>{state.selectedTask.Note}</p>
            <form onChange={handleTaskChange}>
              <label for="textarea">Additional Note:</label>
              <textarea
                cols="40"
                rows="8"
                name="textarea"
                id="taskHistory"
              ></textarea>
              <input
                type="button"
                data-inline="true"
                value="Input"
                onClick={() =>
                  setTaskItemCompleted(state.selectedTask.id, true)
                }
              ></input>
            </form>
          </Modal.Body>
          <Modal.Footer>
            Due: {Moment(state.selectedTask.Due).format("MM/DD/YY")}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
