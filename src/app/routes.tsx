import { createBrowserRouter } from "react-router";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { VoiceDumpScreen } from "./screens/VoiceDumpScreen";
import { TextDumpScreen } from "./screens/TextDumpScreen";
import { ClusteringScreen } from "./screens/ClusteringScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { SynthesisScreen } from "./screens/SynthesisScreen";
import { ProjectScreen } from "./screens/ProjectScreen";
import { PipelineScreen } from "./screens/PipelineScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomeScreen,
  },
  {
    path: "/voice",
    Component: VoiceDumpScreen,
  },
  {
    path: "/text",
    Component: TextDumpScreen,
  },
  {
    path: "/cluster",
    Component: ClusteringScreen,
  },
  {
    path: "/pipeline",
    Component: PipelineScreen,
  },
  {
    path: "/dashboard",
    Component: DashboardScreen,
  },
  {
    path: "/search",
    Component: SearchScreen,
  },
  {
    path: "/synthesis",
    Component: SynthesisScreen,
  },
  {
    path: "/project",
    Component: ProjectScreen,
  },
]);