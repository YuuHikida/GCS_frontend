const isDev = process.env.REACT_APP_DEBUG === "development";

export const logDebug = (...args) => {
    console.log("isDev is = " + isDev);
    if (isDev) console.log(...args);
  };

  //使い方: logDebug(値)