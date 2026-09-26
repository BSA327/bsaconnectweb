import EntityCrud from "./EntityCrud";

export default function Inventory() {
  return (
    <EntityCrud
      title="Inventory"
      endpoint="/inventory"
      searchField="title"
      searchPlaceholder="Search by title"
      fields={[
        {
          name: "title",
          label: "Title",
          type: "text",
        },
        {
          name: "location",
          label: "Location",
          type: "text",
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          options: [
            "NA_LAND",
            "AGRICULTURE_LAND",
            "INDEPENDENT_HOUSE",
            "APRATMENT",
            "COMMERCIAL_PROPERTY",
          ],
        },
        {
          name: "size",
          label: "Size",
          type: "text",
        },
        {
          name: "price",
          label: "Price",
          type: "number",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            "AVAILABLE",
            "RESERVED",
            "SOLD",
            "INACTIVE",
          ],
        },
        {
          name: "remarks",
          label: "Remarks",
          type: "textarea",
        },
        {
          name: "customerId",
          label: "Customer",
          type: "customer",
        },
      ]}
    />
  );
}