 import React from "react";


export const UserContext = React.createContext({
      btmnav: 0,
      user: {
        signedIn: false,
        customerID: null,
        username: "__default"
      }
  }
);
