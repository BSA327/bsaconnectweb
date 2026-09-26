import axios from "axios";

/*
 * ==========================================================
 * SINGLE API CONFIGURATION FILE
 * ==========================================================
 * Change VITE_API_BASE_URL in .env.
 * All endpoint URLs are maintained here.
 * ==========================================================
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://bsagroup.ltd:4270/bsacoretest/api";

export const ENDPOINTS = {
  auth: {
    login: "/auth/authenticate",
  },

  users: {
    list: "/users",
    create: "/users",
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
    changePassword: "/users/changepassword",
  },

  attendance: {
    checkIn: "/attendance/check-in",
    checkOut: "/attendance/check-out",
    my: "/attendance/my",
    search: "/attendance/search",
  },

  tasks: {
    my: "/tasks/my",
    create: "/tasks",
    search: "/tasks/search",
  },

  customers: {
    list: "/customers",
    create: "/customers",
    update: (id) => `/customers/${id}`,
    view: (id) => `/customers/${id}`,
  },

  agents: {
    list: "/agents",
    create: "/agents",
    update: (id) => `/agents/${id}`,
    view: (id) => `/agents/${id}`,
  },

  inventory: {
    list: "/inventory",
    create: "/inventory",
    update: (id) => `/inventory/${id}`,
    view: (id) => `/inventory/${id}`,
    media: (id) => `/inventory/${id}/media`,
  },

  enquiries: {
    list: "/enquiries",
    create: "/enquiries",
    update: (id) => `/enquiries/${id}`,
    view: (id) => `/enquiries/${id}`,
  },

  siteVisits: {
    list: "/site-visits",
    create: "/site-visits",
    update: (id) => `/site-visits/${id}`,
    view: (id) => `/site-visits/${id}`,
    search: "/site-visits/search",
  },

  dashboard: {
  statics: "/dashboard/fetchstatics",
  },
};


/*
 * ==========================================================
 * AXIOS INSTANCE
 * ==========================================================
 */

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


/*
 * ==========================================================
 * GLOBAL API LOADER
 * ==========================================================
 *
 * The loader is controlled automatically by Axios.
 *
 * No need to use:
 *
 * setLoading(true)
 * setLoading(false)
 *
 * inside components.
 * ==========================================================
 */

let activeRequests = 0;

const showLoader = () => {
  activeRequests++;

  window.dispatchEvent(
    new CustomEvent("api-loading", {
      detail: true,
    })
  );
};

const hideLoader = () => {
  activeRequests--;

  if (activeRequests <= 0) {
    activeRequests = 0;

    window.dispatchEvent(
      new CustomEvent("api-loading", {
        detail: false,
      })
    );
  }
};


/*
 * ==========================================================
 * REQUEST INTERCEPTOR
 * ==========================================================
 */

api.interceptors.request.use(
  (config) => {

    // Show global loader
    showLoader();

    // Get JWT token
    const token = localStorage.getItem("bsa_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    // Hide loader if request could not be created
    hideLoader();

    return Promise.reject(error);
  }
);


/*
 * ==========================================================
 * RESPONSE INTERCEPTOR
 * ==========================================================
 */

api.interceptors.response.use(
  (response) => {

    // Hide global loader
    hideLoader();

    return response;
  },

  (error) => {

    // Hide global loader
    hideLoader();

    /*
     * ======================================================
     * UNAUTHORIZED
     * ======================================================
     */

    if (error.response?.status === 401) {

      localStorage.removeItem("bsa_token");
      localStorage.removeItem("bsa_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


/*
 * ==========================================================
 * AUTH
 * ==========================================================
 */

export const loginApi = (payload) =>
  api.post(ENDPOINTS.auth.login, payload);

/*
 * ==========================================================
 * USERS
 * ==========================================================
 */

export const getUsers = (params) =>
  api.get(ENDPOINTS.users.list, { params });

export const createUser = (payload) =>
  api.post(ENDPOINTS.users.create, payload);

export const updateUser = (id, payload) =>
  api.put(ENDPOINTS.users.update(id), payload);

export const deleteUser = (id) =>
  api.delete(ENDPOINTS.users.delete(id));

export const changePasswordApi = (payload) =>
  api.put(ENDPOINTS.users.changePassword, payload);

/*
 * ==========================================================
 * ATTENDANCE
 * ==========================================================
 */

export const checkInApi = (payload) =>
  api.post(ENDPOINTS.attendance.checkIn, payload);

export const checkOutApi = (payload) =>
  api.post(ENDPOINTS.attendance.checkOut, payload);

export const getMyAttendance = (params) =>
  api.get(ENDPOINTS.attendance.my, { params });

export const searchAttendance = (params) =>
  api.get(ENDPOINTS.attendance.search, { params });


/*
 * ==========================================================
 * TASKS
 * ==========================================================
 */

export const getMyTasks = (params) =>
  api.get(ENDPOINTS.tasks.my, { params });

export const createTask = (payload) =>
  api.post(ENDPOINTS.tasks.create, payload);

export const searchTasks = (params) =>
  api.get(ENDPOINTS.tasks.search, { params });


/*
 * ==========================================================
 * CUSTOMERS
 * ==========================================================
 */

export const getCustomers = (params) =>
  api.get(ENDPOINTS.customers.list, { params });

export const createCustomer = (payload) =>
  api.post(ENDPOINTS.customers.create, payload);

export const updateCustomer = (id, payload) =>
  api.put(ENDPOINTS.customers.update(id), payload);

export const getCustomer = (id) =>
  api.get(ENDPOINTS.customers.view(id));


/*
 * ==========================================================
 * AGENTS
 * ==========================================================
 */

export const getAgents = (params) =>
  api.get(ENDPOINTS.agents.list, { params });

export const createAgent = (payload) =>
  api.post(ENDPOINTS.agents.create, payload);

export const updateAgent = (id, payload) =>
  api.put(ENDPOINTS.agents.update(id), payload);

export const getAgent = (id) =>
  api.get(ENDPOINTS.agents.view(id));


/*
 * ==========================================================
 * INVENTORY
 * ==========================================================
 */

export const getInventory = (params) =>
  api.get(ENDPOINTS.inventory.list, { params });

export const createInventory = (payload) =>
  api.post(ENDPOINTS.inventory.create, payload);

export const updateInventory = (id, payload) =>
  api.put(ENDPOINTS.inventory.update(id), payload);

export const getInventoryItem = (id) =>
  api.get(ENDPOINTS.inventory.view(id));

export const uploadInventoryMedia = (id, formData) =>
  api.post(
    ENDPOINTS.inventory.media(id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );


/*
 * ==========================================================
 * ENQUIRIES
 * ==========================================================
 */

export const getEnquiries = (params) =>
  api.get(ENDPOINTS.enquiries.list, { params });

export const createEnquiry = (payload) =>
  api.post(ENDPOINTS.enquiries.create, payload);

export const updateEnquiry = (id, payload) =>
  api.put(ENDPOINTS.enquiries.update(id), payload);

export const getEnquiry = (id) =>
  api.get(ENDPOINTS.enquiries.view(id));


/*
 * ==========================================================
 * SITE VISITS
 * ==========================================================
 */

export const getSiteVisits = (params) =>
  api.get(ENDPOINTS.siteVisits.list, { params });

export const createSiteVisit = (payload) =>
  api.post(ENDPOINTS.siteVisits.create, payload);

export const updateSiteVisit = (id, payload) =>
  api.put(ENDPOINTS.siteVisits.update(id), payload);

export const getSiteVisit = (id) =>
  api.get(ENDPOINTS.siteVisits.view(id));

export const searchSiteVisits = (params) =>
  api.get(ENDPOINTS.siteVisits.search, { params });


/*
 * ==========================================================
 * DASHBOARD
 * ==========================================================
 */

export const getDashboardStatics = () =>
  api.get(ENDPOINTS.dashboard.statics);