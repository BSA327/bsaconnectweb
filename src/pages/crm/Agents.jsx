import EntityCrud from "./EntityCrud";

export default function Agents() {
  return (
    <EntityCrud
      title="Agents / CP"
      endpoint="/agents"
      searchField="name"
      searchPlaceholder="Search by agent name"
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
          name: "city",
          label: "City",
          type: "text",
        },
        {
          name: "remarks",
          label: "Remarks",
          type: "textarea",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            "ACTIVE",
            "INACTIVE",
          ],
        },
      ]}
    />
  );
}