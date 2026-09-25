import EntityCrud from "./EntityCrud";
export default function Agents(){return <EntityCrud title="Agents / CP" endpoint="/agents" fields={["name","phone","email","city","status"]}/>;}