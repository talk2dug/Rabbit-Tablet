import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import Home from "./components/Home";
import { GlobalContext } from "./contexts/globalContext";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import Moment from "moment";
let Does = [];
let Bucks = [];
let pastDueTasks = [];
let todayTasks = [];
let futureTasks = [];
let completedTasks = [];
let breedersSelect = [];

export default function App() {
  const [state, dispatch] = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(true);
  function setData(data, type) {
    dispatch({
      type: type,
      payload: data,
    });
    setIsLoading(false);
  }
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Asheville&appid=3386b402cbc76407f825bbfcadfd1598&units=imperial`
      );
      const weatherData = response.data;
      //res.json(weatherData);
      weatherData.weatherIcon =
        `https://openweathermap.org/img/wn/` +
        weatherData.weather[0].icon +
        `.png`;

      dispatch({
        type: "weatherData",
        payload: weatherData,
      });
      //setData(,)
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
    }
  };
  const fetchRabbits = () => {
    pastDueTasks.length = 0;
    axios
      .get("http://192.168.0.156:3000/database/getRabbits")
      .then((response) => {
        Does.length = 0;
        Bucks.length = 0;
        // Handle the fetched data
        //console.log(response.data);
        let data = response.data;
        let ReadyToBreed = [];
        data.map((rabbit) => {
          if (rabbit.Sex == "Doe") {
            const date1 = Moment(rabbit.DateReadyToBreed).local();
            const date2 = Moment();
            const diff = date1.diff(date2, "days");
            console.log("diff: ", diff);
            if (diff > 0) {
              ReadyToBreed.push({
                Rabbit: rabbit.Name,
                Days: "Ready to Breed in " + diff + " days",
              });
              console.log("Ready to Breed in " + diff + " days");
            }
            if (diff == 0) {
              console.log("Ready to Breed Today ");
              ReadyToBreed.push({
                Rabbit: rabbit.Name,
                Days: "Ready to Breed ",
              });
            }
          }
          if (rabbit.Sex === "Doe") {
            Does.push(rabbit.Name);
          }
          if (rabbit.Sex === "Buck") {
            Bucks.push(rabbit.Name);
          }
          return "ff";
        });
        setData(ReadyToBreed, "ReadyToBreed");

        setData(response.data, "NEW_Rabbits");
        setData(Does, "Does");
        setData(Bucks, "Bucks");
      })
      .catch((error) => {
        // Handle any errors during the request
        console.error("Error fetching data:", error);
      });
  };
  const fetchDataTasks = () => {
    axios
      .get("http://192.168.0.156:3000/database/getTasks")
      .then((response) => {
        // Handle the fetched data
        completedTasks.length = 0;
        futureTasks.length = 0;
        todayTasks.length = 0;
        let weeklyViewTasks = {
          yesterday: [],
          today1: [],
          today2: [],
          today3: [],
          today4: [],
          today5: [],
          today6: [],
        };
        setData(response.data, "NEW_Tasks");
        response.data.map((task) => {
          let datetocheck = Moment(task.Due).format("MM/DD/YY");
          let cleanedDate = Moment(datetocheck);
          let todaysDate = Moment().format("MM/DD/YY");
          let today = cleanedDate.diff(todaysDate, "days");
          if (task.Completed === false) {
            switch (today) {
              case -1:
                weeklyViewTasks.yesterday.push(task);
                break;
              case 0:
                weeklyViewTasks.today1.push(task);
                break;
              case 1:
                weeklyViewTasks.today2.push(task);
                break;
              case 2:
                weeklyViewTasks.today3.push(task);
                break;
              case 3:
                weeklyViewTasks.today4.push(task);
                break;
              case 4:
                weeklyViewTasks.today5.push(task);
                break;
              case 5:
                weeklyViewTasks.today6.push(task);
                break;
              default:
                break;
            }
          }

          if (task.Completed === true) {
            completedTasks.push(task);
          }
          if (task.Completed === false) {
            console.log(today);
            if (today === 0) {
              //console.log('date is today');
              todayTasks.push(task);
            } else if (!Moment(task.Due).isBefore(Moment().local())) {
              futureTasks.push(task);
            } else if (Moment(task.Due).isBefore(Moment())) {
              pastDueTasks.push(task);
            }
          }
          return "ff";
        });
        console.log(weeklyViewTasks);
        setData(todayTasks, "TodaysTasks");
        setData(pastDueTasks, "PastTasks");
        setData(futureTasks, "FutureTasks");
        setData(completedTasks, "completedTasks");
        setData(weeklyViewTasks, "weeklyViewTasks");
      })
      .catch((error) => {
        // Handle any errors during the request
        console.error("Error fetching data:", error);
      });
  };

  const fetchGrowing = () => {
    axios
      .get("http://192.168.0.156:3000/database/getGrowing")
      .then((response) => {
        // Handle the fetched data
        //console.log(response.data);

        let kidData = response.data;

        setData(kidData, "GrowingRabbits");
      })
      .catch((error) => {
        // Handle any errors during the request
        console.error("Error fetching data:", error);
      });
  };
  const fetchBreeders = () => {
    axios
      .get("http://192.168.0.156:3000/database/getBreeders")
      .then((response) => {
        // Handle the fetched data
        //console.log(response.data);
        breedersSelect.length = 0;
        let breedeers = response.data;

        setData(breedeers, "Breeders");
        breedeers.map((breeder) => {
          breedersSelect.push(breeder.Name);
          console.log(breedersSelect);
        });
        setData(breedersSelect, "BreedersSelect");
      })
      .catch((error) => {
        // Handle any errors during the request
        console.error("Error fetching data:", error);
      });
  };
  const fetchDataLitters = () => {
    axios
      .get("http://192.168.0.156:3000/database/getRabbitLitters")
      .then((response) => {
        console.log(response);
        // Handle the fetched data
        setData(response.data, "NEW_Litters");
      })
      .catch((error) => {
        // Handle any errors during the request
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    function refreshData() {
      fetchWeatherData();
      fetchDataLitters();
      fetchRabbits();
      fetchGrowing();
      fetchDataTasks();
      fetchBreeders();
      fetchDataTasks();
      dispatch({
        type: "reloadRabbits",
        payload: false,
      });
      console.log(state);
      if (state.SelectedRabbit.length < 0) {
        let TasksToSearch = state.Tasks;
        const foundTaskItem = TasksToSearch.filter(
          (itemTask) => itemTask.Rabbit === state.SelectedRabbit.Name
        );
        dispatch({
          type: "SelectedRabbitTasks",
          payload: foundTaskItem,
        });
      }
      //  axios.get('http://192.168.0.156:3000/database/getRabbits')
      //    .then(response => {

      //      // Handle the fetched data
      //      //console.log(response.data);
      //      let data = response.data;
      //      dispatch({
      //        type: 'NEW_Rabbits',
      //        payload: data,
      //      });
      //        return ('ff')

      //    })
      //    .catch(error => {
      //      // Handle any errors during the request
      //      console.error('Error fetching data:', error);
      //    });
    }

    refreshData();

    // eslint-disable-next-line
  }, [state.reloadRabbits]);
  useEffect(() => {
    if (state.reloadSelectedDrowingRabbit == true) {
      console.log(state.SelectedGrowingKid.KidID);
      fetchGrowing();

      dispatch({
        type: "reloadSelectdGrowing",
        payload: true,
      });
    }
  }, [state.reloadSelectedDrowingRabbit]);

  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  function navigate(screen) {
    dispatch({
      type: screen,
      payload: true,
    });
    dispatch({
      type: "showRabbitInfo",
      payload: false,
    });
    console.log(state);
  }
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Navbar.Brand href="#home">Dix Creek Rabbit Farm</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link onClick={() => navigate("showHome")}>Home</Nav.Link>
        </Nav>
      </Navbar>
      <Home />
    </>
  );
}
