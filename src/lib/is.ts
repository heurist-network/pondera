export const isString = (value: unknown): value is string =>
  typeof value === "string";
export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean";
export const isNumber = (value: unknown): value is number =>
  typeof value === "number";
export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

export const isMobile = () => {
  const userAgentInfo = navigator.userAgent;

  const mobileAgents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];

  let mobile_flag = false;

  // by userAgent
  for (let v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }
  const screen_width = window.screen.width;
  const screen_height = window.screen.height;

  // by screen width
  if (screen_width > 325 && screen_height < 768) {
    mobile_flag = true;
  }

  return mobile_flag;
};

export const isUrl = (url?: string) => {
  if (!url) return false;
  const regex = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
  return regex.test(url);
};
