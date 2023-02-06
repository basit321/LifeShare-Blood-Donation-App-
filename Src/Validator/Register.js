export const RegisterValidator = (data) => {
  const error = {};

  if (!data.pictrue) {
    error.pictrue = "Picture is Required";
  }
  if (!data.name) {
    error.name = "Name is Required";
  } else if (data.name.length < 2) {
    error.name = "Name is too short";
  }
  if (!data.age) {
    error.age = "Age is Required";
  }
  if (!data.gender) {
    error.gender = "Gender is Required";
  }
  if (!data.country) {
    error.country = "Country is Required";
  }

  if (!data.city) {
    error.city = "City is Required";
  }

  if (!data.phonenumber) {
    error.phonenumber = "Phone number  is Required";
  } else if (data.phonenumber.length < 5) {
    error.phonenumber = "Invalid phone number format";
  }
  if (!data.bloodgroup) {
    error.bloodgroup = "Blood group is Required";
  }

  return error;
};
export const LoginValidation = (data) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const error = {};
  if (!data.email) {
    error.email = "Email is Required";
  } else if (reg.test(data.email) === false) {
    error.email = "Invalid Email Format";
  }
  if (!data.password) {
    error.password = "Password is Required";
  } else if (data.password.length < 2) {
    error.password = "Password is Short";
  }

  return error;
};
export const Addteamvalidator = (data) => {
  const error = {};
  if (!data.logo) {
    error.logo = "Logo is Required";
  }
  if (!data.title) {
    error.title = "Tittle is Required";
  }
  if (!data.city) {
    error.city = "City is Required";
  }
  if (!data.Volunteer) {
    error.Volunteer = "Members is Required";
  }

  return error;
};
export const Addpostvalidator = (data) => {
  const error = {};
  if (!data.Request) {
    error.Request = "Request is Required";
  }
  console.log(data.Description.length);
  if (!data.Description) {
    error.Description = "Description is Required";
  } else if (data.Description.length < 20) {
    error.Description = "Description is too short";
  }
  if (!data.Bloodtype) {
    error.Bloodtype = "Bloodtype is Required";
  } else if (data.Bloodtype.length < 1) {
    error.Bloodtype = "Bloodtype is too short";
  }
  if (!data.Qunatity) {
    error.Qunatity = "Qunatity is Required";
  }
  if (!data.sugery) {
    error.sugery = "This field is Required";
  }

  return error;
};

export const PaymentValidation = (data) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  const error = {};
  if (!data.email) {
    error.email = "Email is Required";
  } else if (reg.test(data.email) === false) {
    error.email = "Invalid Email Format";
  }

  return error;
};
export const PaswordValidation = (data) => {
  const error = {};

  if (!data.password) {
    error.password = "Password is Required";
  } else if (data.password.length < 4) {
    error.password = "Password is Short";
  }

  return error;
};
