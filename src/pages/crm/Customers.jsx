import EntityCrud from "./EntityCrud";
export default function Customers(){return <EntityCrud title="Customers" endpoint="/customers" fields={["name","phone","email","source","status"]}/>;}