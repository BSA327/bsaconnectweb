import EntityCrud from "./EntityCrud";

export default function Enquiries() {
  return (
    <EntityCrud
      title="Enquiries"
      endpoint="/enquiries"
      searchField="location"
      searchPlaceholder="Search by location"
      fields={[
        {
          name: "customerId",
          label: "Customer",
          type: "customer",
        },
        {
          name: "date",
          label: "Date",
          type: "date",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            "OPEN",
            "IN_PROCESS",
            "SUCCESS",
            "FAILED",
          ],
        },
        
        {
          name: "location",
          label: "Location",
          type: "text",
        },
        {
          name: "timeline",
          label: "Timeline",
          type: "text",
        },
        {
          name: "budget",
          label: "Budget",
          type: "text",
        },
        {
        name: "financeAssistance",
        label: "Finance Assistance",
        type: "select",
        options: [
            "YES",
            "NO",
            "MAY_BE",
        ],
        },
        
        {
          name: "details",
          label: "Details",
          type: "textarea",
        },
      
      ]}
    />
  );
}