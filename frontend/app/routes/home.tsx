import { useLoaderData } from "react-router";

export async function loader() {
  try {
    const response = await fetch("http://localhost:8000/");
    const data = await response.json();
    return { apiStatus: data.status };
  } catch (error) {
    return { apiStatus: "AI Engine Offline" };
  }
}

export default function Home() {
  const { apiStatus } = useLoaderData();
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>ApplyFlow AI Dashboard</h1>
      <p>System Status: <strong>{apiStatus}</strong></p>
    </div>
  );
}
