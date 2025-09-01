import React, { useReducer, createContext } from "react";
import update from "react-addons-update";
import Moment from "moment";
export const GlobalContext = createContext();

const initialState = {
  weatherData: { data: [] },
  Rabbits: [],
  Breeders: [],
  BreededSelected: false,
  GrowingKidSelected: false,
  selectedBreeder: {
    Name: "1",
    Farm: "1",
    Address: "1",
    City: "1",
    State: "1",
    Zip: "1",
    Email: "1",
    Phone: "1",
    Note: "1",
    Purchases: [
      {
        Rabbit: "1",
        Purchased: "1",
        Cost: "1",
      },
    ],
  },
  showBreeders: false,
  BreedersSelect: {},
  ReadyToBreed: [],
  BreedersSelectPurchases: [],
  Bucks: [],
  Does: [],
  Litters: [],
  TodaysTasks: [],
  PastTasks: [],
  FutureTasks: [],
  completedTasks: [],
  weeklyViewTasks: {
    yesterday: [],
    today1: [],
    today2: [],
    today3: [],
    today4: [],
    today5: [],
    today6: [],
  },
  GrowingRabbits: [],
  SelectedRabbitTasks: [],
  showSettings: false,
  showLitterNewModal: false,
  showTaskItemModal: false,
  showBreederNewModal: false,
  showAddWeightsModal: false,
  showBreederEditModal: false,
  showNewRabbitModal: false,
  SelectedRabbit: { Name: "NONE", id: "sdfg" },
  SelectedRabbitsLitters: {},
  SelectedRabbitLatestMate: {},
  SelectedGrowingKid: {},
  SelectedGrowingKidWeights: {},
  SelectedGrowingKidLables: {},
  SelectedGrowingKidNotes: {},
  SelectedGrowingKidTasks: {},
  selectedTask: {},
  SelectedRabbitNotes: [],
  SelectedRabbitCurrentWeight: String,
  SelectedLitter: {},
  SelectedLitterKids: [],
  SelectedKid: {
    Notes: {},
  },
  showHome: true,
  showRabbits: false,
  showTasks: false,
  showLitters: false,
  showGrowing: false,
  reloadRabbits: false,
  reloadSelectedDrowingRabbit: false,
  reloadSelectdGrowing: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case "AddPurchaseShow":
      return {
        ...state,
        AddPurchaseShow: action.payload,
        BreededSelected: true,
        showHome: false,
        showRabbits: false,
        showTasks: false,
        showLitters: false,
        showGrowing: false,
        showBreeders: true,
      };
    case "showNewRabbitModal":
      return {
        ...state,
        showNewRabbitModal: action.payload,
        showHome: false,
        showRabbits: true,
        showTasks: false,
        showLitters: false,
        showGrowing: false,
      };

    case "showLitterEditModal":
      return {
        ...state,
        showLitterEditModal: action.payload,
        showHome: false,
        showRabbits: false,
        showTasks: false,
        showLitters: true,
        showGrowing: false,
      };

    case "showBreederEditModal":
      return {
        ...state,
        showBreederEditModal: action.payload,
        BreededSelected: true,
        showHome: false,
        showRabbits: false,
        showTasks: false,
        showLitters: false,
        showGrowing: false,
        showBreeders: true,
      };
    case "GrowingKidSelected":
      return {
        ...state,
        GrowingKidSelected: action.payload,
      };
    case "showAddWeightsModal":
      return {
        ...state,
        showAddWeightsModal: action.payload,
        BreededSelected: false,
        GrowingKidSelected: false,
        showHome: false,
        showRabbits: false,
        showTasks: false,
        showLitters: false,
        showGrowing: true,
        showBreeders: true,
      };
    case "showBreederNewModal":
      return {
        ...state,
        showBreederNewModal: action.payload,
        BreededSelected: true,
        showHome: false,
        showRabbits: false,
        showTasks: false,
        showLitters: false,
        showGrowing: false,
        showBreeders: true,
      };

    case "showTaskItemModal":
      return {
        ...state,
        showTaskItemModal: action.payload,
      };
    case "showLitterNewModal":
      return {
        ...state,
        showLitterNewModal: action.payload,
        showHome: false,
        showRabbits: false,
        showTasks: false,
        showLitters: true,
        showGrowing: false,
        BreededSelected: false,
      };
    case "weatherData":
      return {
        ...state,
        weatherData: action.payload,
      };
    case "SelectedRabbitCurrentWeight":
      return {
        ...state,
        SelectedRabbitCurrentWeight: action.payload,
      };
    case "reloadSelectedDrowingRabbit":
      return {
        ...state,
        reloadSelectedDrowingRabbit: action.payload
      };
      case "reloadSelectdGrowing":
        return {
          ...state,
          reloadSelectdGrowing: action.payload
        };
    case "reloadRabbits":
      return {
        ...state,
        reloadRabbits: action.payload,
        BreededSelected: false,
      };
    case "Breeders":
      return {
        ...state,
        Breeders: action.payload,
        BreededSelected: false,
      };

    case "BreededSelected":
      return {
        ...state,
        BreededSelected: action.payload,
      };
    case "selectedBreeder":
      return {
        ...state,
        selectedBreeder: action.payload,
      };
    case "BreedersSelectPurchases":
      return {
        ...state,
        BreedersSelectPurchases: action.payload,
      };

    case "BreedersSelect":
      return {
        ...state,
        BreedersSelect: action.payload,
      };

    case "ReadyToBreed":
      return {
        ...state,
        ReadyToBreed: action.payload,
      };
    case "Bucks":
      return {
        ...state,
        Bucks: action.payload,
      };

    case "Does":
      return {
        ...state,
        Does: action.payload,
      };
    case "FutureTasks":
      return {
        ...state,
        FutureTasks: action.payload,
      };

    case "SelectedGrowingKid":
      return {
        ...state,
        SelectedGrowingKid: action.payload,
      };
    case "SelectedGrowingKidLables":
      return {
        ...state,
        SelectedGrowingKidLables: action.payload,
      };

    case "SelectedGrowingKidWeights":
      return {
        ...state,
        SelectedGrowingKidWeights: action.payload,
      };

    case "SelectedKid":
      return {
        ...state,
        SelectedKid: action.payload,
      };
    case "SelectedRabbitsLitters":
      return {
        ...state,
        SelectedRabbitsLitters: action.payload,
      };

    case "selectedTask":
      return {
        ...state,
        selectedTask: action.payload,
      };
    case "completedTasks":
      return {
        ...state,
        completedTasks: action.payload,
      };
    case "weeklyViewTasks":
      return {
        ...state,
        weeklyViewTasks: action.payload,
      };
    case "UpdateTaskCompleted":
      const index = state.PastTasks.findIndex((todo) => todo._id === action.id);
      console.log(index);
      const newArray = [...state.PastTasks]; //making a new array
      console.log(newArray);
      newArray[index].Completed = true; //changing value in the new array

      return {
        ...state, //copying the orignal state
        PastTasks: newArray, //reassingning todos to new array
      };

    case "PastTasks":
      return {
        ...state,
        PastTasks: action.payload,
      };

    case "TodaysTasks":
      return {
        ...state,
        TodaysTasks: action.payload,
      };
    case "addBucks":
      return {
        ...state,
        Bucks: action.payload,
      };
    case "addDoes":
      return {
        ...state,
        Does: action.payload,
      };
    case "GrowingRabbits":
      return {
        ...state,
        GrowingRabbits: action.payload,
      };
    case "NEW_Rabbits":
      return {
        ...state,
        Rabbits: action.payload,
      };
    case "NEW_Litters":
      return {
        ...state,
        Litters: action.payload,
      };
    case "NEW_Tasks":
      return {
        ...state,
        Tasks: action.payload,
      };
    case "SelectedRabbit":
      let mated = action.payload.Mated;
      mated = mated.reverse();

      console.log(mated[0]);

      return {
        ...state,
        SelectedRabbit: action.payload,
        SelectedRabbitLatestMate: mated[0],
      };

    case "SelectedGrowingKidNotes":
      return {
        ...state,
        SelectedGrowingKidNotes: action.payload,
      };
    case "SelectedGrowingKidTasks":
      return {
        ...state,
        SelectedGrowingKidTasks: action.payload,
      };
    case "SelectedRabbitNotes":
      return {
        ...state,
        SelectedRabbitNotes: action.payload,
      };
    case "SelectedRabbitTasks":
      return {
        ...state,
        SelectedRabbitTasks: action.payload,
      };
    case "SelectedLitter":
      return {
        ...state,
        SelectedLitter: action.payload,
      };
    case "SelectedLitterKids":
      return {
        ...state,
        SelectedLitterKids: action.payload,
      };
    case "showBreeders":
      return {
        ...state,
        showHome: false,
        showRabbits: false,
        showTasks: false,
        showLitters: false,
        showGrowing: false,
        showBreeders: true,
        BreededSelected: false,
      };
    case "showLitters":
      return {
        ...state,
        showHome: false,
        BreededSelected: false,
        showRabbits: false,
        showTasks: false,
        showLitters: true,
        showGrowing: false,
        showBreeders: false,
      };
    case "showHome":
      return {
        ...state,
        showHome: true,
        BreededSelected: false,
        showRabbits: false,
        showTasks: false,
        showLitters: false,
        showGrowing: false,
        showBreeders: false,
      };
    case "showRabbitInfo":
      return {
        ...state,
        showRabbitInfo: action.payload,
        BreededSelected: false,
      };
    case "showRabbits":
      return {
        ...state,
        showHome: false,
        BreededSelected: false,
        showRabbits: true,
        showTasks: false,
        showLitters: false,
        showGrowing: false,
        showBreeders: false,
      };
    case "showTasks":
      return {
        ...state,
        showHome: false,
        BreededSelected: false,
        showTasks: true,
        showRabbits: false,
        showLitters: false,
        showGrowing: false,
        showBreeders: false,
      };
    case "showGrowing":
      return {
        ...state,
        showHome: false,
        BreededSelected: false,
        showTasks: false,
        showRabbits: false,
        showLitters: false,
        showGrowing: true,
        showBreeders: false,
      };

    default:
      throw new Error();
  }
};

export const GlobalContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {" "}
      {props.children}{" "}
    </GlobalContext.Provider>
  );
};
