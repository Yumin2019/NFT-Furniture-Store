const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const infoToast = (toast, text) => {
  toast({
    title: text,
    status: "info",
    isClosable: true,
  });
};

const errorToast = (toast, text) => {
  toast({
    title: text,
    status: "error",
    isClosable: true,
  });
};

const successToast = (toast, text) => {
  toast({
    title: text,
    status: "success",
    isClosable: true,
  });
};

const getQueryParam = () => {
  return window.location.pathname.split("/")[2];
};

const dateToString = (str) => {
  return new Date(str).toLocaleString();
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
};

export {
  validateEmail,
  getQueryParam,
  dateToString,
  getRandomInt,
  infoToast,
  errorToast,
  successToast,
};
