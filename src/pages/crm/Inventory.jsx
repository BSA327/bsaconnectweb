import EntityCrud from "./EntityCrud";
export default function Inventory(){
  return <EntityCrud title="Inventory" endpoint="/inventory"
    fields={["title","location","type","area","price","status","description"]}
    media />;
}