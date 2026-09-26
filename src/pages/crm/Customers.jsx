import EntityCrud from "./EntityCrud";

export default function Customers() {
  return (
    <EntityCrud
      title="Customers"
      endpoint="/customers"
      fields={[
        {
          name: "name",
          label: "Name",
          type: "text",
        },
        {
          name: "phone",
          label: "Phone",
          type: "text",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
        },
        {
          name: "source",
          label: "Source",
          type: "select",
          options: [
            "ONLINE",
            "OFFLINE",
            "FIELD_WORK",
          ],
        },
       
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            "BUY",
            "SELL",
            "BOTH",
          ],
        },
        {
          name: "address",
          label: "Address",
          type: "textarea",
        },
        {
          name: "remarks",
          label: "Remarks",
          type: "textarea",
        },
        
      ]}
    />
  );
}